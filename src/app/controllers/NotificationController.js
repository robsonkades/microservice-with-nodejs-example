import User from '~/app/models/User';
import Notification from '~/app/schemas/Notification';

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

  async update(req, res) {
    const notification = Notification.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
      },
      {
        new: true,
      }
    );
    return res.json(notification);
  }
}

export default new NotificationController();
