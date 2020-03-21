import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário e/ou senha inválidos' });
    }

    const isMatch = await user.checkPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Usuário e/ou senha inválidos' });
    }

    const { id, name } = user;

    return res.status(200).json({
      user: { id, name, email },
      token: await jwt.sign({ id, name, email }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
