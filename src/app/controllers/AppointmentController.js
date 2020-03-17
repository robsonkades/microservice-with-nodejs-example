import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import Mail from '../../lib/Mail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.user.id,
        canceled_at: null,
      },
      attributes: ['id', 'date'],
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
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validação falhou!' });
    }

    const { provider_id, date } = req.body;

    const isProvider = User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({ error: 'Acesso negado' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res
        .status(400)
        .json({ error: 'Não é permitido informar uma data no passado.' });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Horário não disponível' });
    }

    const appointment = Appointment.create({
      user_id: req.user.id,
      provider_id,
      hourStart,
    });

    const user = await User.findByPk(req.user.id);
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

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (appointment.user_id !== req.user.id) {
      return res.status(401).json({ error: 'Acesso negado' });
    }

    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub > new Date())) {
      return res.status(401).json({
        error: 'Somente é permitido cancelar um agendamento acima de 2 horas',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save(appointment);

    await Mail.sendEmail({
      to: `${appointment.provider.email} <${appointment.provider.name}>`,
      subject: 'Agendamento cancelado',
      text: 'Você tem um novo cancelamento',
    });

    return res.json();
  }
}

export default new AppointmentController();
