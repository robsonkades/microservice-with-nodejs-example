import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleService {
  async run({ user_id, date }) {
    const checkUserProvider = await User.findOne({
      where: {
        id: user_id,
        provider: true,
      },
    });

    if (!checkUserProvider) {
      throw new Error('Usuário não é um prestador de serviço.');
    }

    const parsedDate = parseISO(date);

    const appointments = Appointment.findAll({
      where: {
        provider_id: user_id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return appointments;
  }
}

export default new ScheduleService();
