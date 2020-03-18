/* eslint-disable no-console */

export default {
  key: 'UserRegistration',
  options: {
    delay: 5000,
  },
  async handle({ data }) {
    const { user } = data;
    console.debug(user);
  },
};
