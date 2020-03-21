import { subHours, isBefore } from 'date-fns';

import Cache from '../../lib/Cache';
import Queue from '../../lib/Queue';

import Appointment from '../models/Appointment';
import User from '../models/User';

class CancelAppointmentService {
  async run({ provider_id, user_id }) {
    const appointment = await Appointment.findByPk(provider_id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== user_id) {
      throw new Error('Acesso negado');
    }

    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub > new Date())) {
      throw new Error(
        'Somente é permitido cancelar um agendamento acima de 2 horas'
      );
    }

    appointment.canceled_at = new Date();

    await appointment.save(appointment);

    Queue.add('CancelationEmail', { appointment });

    await Cache.invalidatePrefix(`user:${user_id}:appointments`);

    return appointment;
  }
}

export default new CancelAppointmentService();
