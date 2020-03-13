import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const isProvider = User.findOne({
      where: { id: req.user.id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({ error: 'Acesso negado' });
    }

    const notifications = await Notification.find({
      user: req.user.id,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }
}

export default new NotificationController();
