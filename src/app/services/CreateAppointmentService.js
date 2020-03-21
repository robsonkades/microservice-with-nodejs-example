import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Cache from '../../lib/Cache';

import Appointment from '../models/Appointment';
import User from '../models/User';
import Notification from '../schemas/Notification';

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    const isProvider = User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      throw new Error('Acesso negado');
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      throw new Error('Não é permitido informar uma data no passado.');
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      throw new Error('Horário não disponível.');
    }

    const appointment = Appointment.create({
      user_id,
      provider_id,
      hourStart,
    });

    const user = await User.findByPk(user_id);
    const fomattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMMM',  às' H:mm:'h'",
      {
        locale: pt,
      }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${fomattedDate}`,
      user: provider_id,
    });

    await Cache.invalidatePrefix(`user:${user_id}:appointments`);

    return appointment;
  }
}

export default new CreateAppointmentService();
