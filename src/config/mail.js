import '../bootstrap';

export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  auth: {
    username: process.env.MAIL_USER,
    password: process.env.MAIL_PASS,
  },
  default: {
    from: 'My Company <noreplay@company.com>',
  },
};
