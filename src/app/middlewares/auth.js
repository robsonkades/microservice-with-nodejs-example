import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não autorizado!' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const { id, name, email } = await promisify(jwt.verify)(
      token,
      authConfig.secret
    );
    req.user = { id, name, email };

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token não autorizado!' });
  }
};
