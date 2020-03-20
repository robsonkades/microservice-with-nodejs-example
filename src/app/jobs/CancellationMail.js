import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import Mail from '../../lib/Mail';

export default {
  key: 'CancelationEmail',
  options: {
    delay: 5000,
    limiter: {
      max: 90,
      duration: 1000,
    },
  },
  async handle({ data }) {
    const { appointment } = data;
    await Mail.sendEmail({
      to: `${appointment.provider.email} <${appointment.provider.name}>`,
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia' dd 'de' MMMMM',  às' H:mm:'h'", {
          locale: pt,
        }),
      },
    });
  },
};
