module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'barber_shop',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
