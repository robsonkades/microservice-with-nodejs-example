import exphbs from 'express-handlebars';
import nodemailer from 'nodemailer';
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';

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

    this.configureTemplates();
  }

  configureTemplates() {
    const viewsPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewsPath, 'layouts'),
          partialsDir: resolve(viewsPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewsPath,
        extName: '.hbs',
      })
    );
  }

  sendEmail(message) {
    return this.transporter.sendMail({
      ...mailconfig.default,
      ...message,
    });
  }
}

export default new Mail();
