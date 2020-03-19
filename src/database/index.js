import 'dotenv/config';
import mongoose from 'mongoose';
import Sequelize from 'sequelize';

import configDatabase from '~/config/database';

import Appointment from '~/app/models/Appointment';
import File from '~/app/models/File';
import User from '~/app/models/User';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && models.associate(this.connection.models)
    );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
