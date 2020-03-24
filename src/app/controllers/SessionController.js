import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import CreateSessionService from '../services/CreateSessionService';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await CreateSessionService.run({
      email,
      password,
    });

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
