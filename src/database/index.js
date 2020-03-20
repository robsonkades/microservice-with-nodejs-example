import '../bootstrap';

import mongoose from 'mongoose';
import Sequelize from 'sequelize';

import Appointment from '../app/models/Appointment';
import File from '../app/models/File';
import User from '../app/models/User';
import configDatabase from '../config/database';

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
      model => model.associate && model.associate(this.connection.models)
    );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
