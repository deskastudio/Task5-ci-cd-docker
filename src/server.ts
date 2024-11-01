import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
  });
};

startServer();
