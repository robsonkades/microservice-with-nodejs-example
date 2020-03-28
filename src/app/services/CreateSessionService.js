import File from '../models/File';
import User from '../models/User';

class CreateSessionService {
  async run({ email, password }) {
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      throw new Error('Usuário e/ou senha inválidos');
    }

    const isMatch = await user.checkPassword(password);

    if (!isMatch) {
      throw new Error('Usuário e/ou senha inválidos');
    }

    return user;
  }
}

export default new CreateSessionService();
