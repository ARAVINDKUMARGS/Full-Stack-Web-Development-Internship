import mongoose from 'mongoose';

export async function connectDB(uri) {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
  });

  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}
