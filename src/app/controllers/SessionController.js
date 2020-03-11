import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário e/ou senha inválidos' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Usuário e/ou senha inválidos' });
    }

    const { id, name } = user;
    return {
      user: { id, name, email },
      token: jwt.sign({ id, name, email }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    };
  }
}

export default new SessionController();
