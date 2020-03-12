import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: {
        id: req.user.id,
        provider: true,
      },
    });

    if (!checkUserProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário não é um prestador de serviço.' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = Appointment.findAll({
      where: {
        provider_id: req.user.id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
