import mongoose from 'mongoose';
import { config } from '../config';
import * as models from './models';
import * as queries from './queries';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoDb);
    console.log(`Connected to MongoDB at ${config.mongoDb}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export { models, queries };