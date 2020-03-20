import mongoose from 'mongoose';

class MongoMock {
  async connect() {
    if (!process.env.MONGO_URL) {
      throw new Error('MongoDB server not initialized');
    }

    this.database = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }

  disconnect() {
    return this.database.connection.close();
  }
}

export default new MongoMock();
