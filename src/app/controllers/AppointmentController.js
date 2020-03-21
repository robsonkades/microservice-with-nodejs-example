import Cache from '../../lib/Cache';

import Appointment from '../models/Appointment';
import File from '../models/File';
import User from '../models/User';
import CancelAppointmentService from '../services/CancelAppointmentService';
import CreateAppointmentService from '../services/CreateAppointmentService';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const cacheKey = `user:${req.user.id}:appointments:${page}`;

    const cached = await Cache.get(cacheKey);

    if (cached) {
      res.json(cached);
    }

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.user.id,
        canceled_at: null,
      },
      attributes: ['id', 'date', 'past', 'cancelable'],
      order: ['date'],
      limit: 20,
      offset: (1 - page) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    await Cache.set(cacheKey, appointments);

    return res.json(appointments);
  }

  async store(req, res) {
    const { provider_id, date } = req.body;

    const appointment = await CreateAppointmentService.run({
      provider_id,
      user_id: req.user.id,
      date,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await CancelAppointmentService.run({
      provider_id: req.params.id,
      user_id: req.user.id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
