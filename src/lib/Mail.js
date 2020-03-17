import nodemailer from 'nodemailer';

import mailconfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailconfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
  }

  sendEmail(message) {
    return this.transporter.sendMail({
      ...mailconfig.default,
      ...message,
    });
  }
}

export default new Mail();
