import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export const dbConfig: string = process.env.MONGO_URI;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(dbConfig);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit if connection fails
  }

  // Set up mongoose connection event listeners
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to the database.');
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from the database.');
  });

  mongoose.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error);
  });

  // Optional: Handle process termination
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to application termination.');
    process.exit(0);
  });
};
