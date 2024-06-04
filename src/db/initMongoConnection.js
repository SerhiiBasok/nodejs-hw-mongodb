import mongoose from 'mongoose';
import { env } from '../utils/env.js';

const initMongoConnection = async () => {
  const user = env('MONGODB_USER');
  const password = env('MONGODB_PASSWORD');
  const url = env('MONGODB_URL');
  const dbName = env('MONGODB_DB');

  const uri = `mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default initMongoConnection;
