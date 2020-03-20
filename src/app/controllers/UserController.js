import * as Yup from 'yup';

import Queue from '../../lib/Queue';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou!' });
    }

    const userExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe.' });
    }
    const { id, name, email, provider } = await User.create(req.body);
    const user = { id, name, email, provider };
    Queue.add('UserRegistration', { user });

    return res.json(user);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou!' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res
          .status(400)
          .json({ error: `Já existe um usuário com o email: ${email}` });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Senha inválida' });
    }

    const { id, name, provider } = await User.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
