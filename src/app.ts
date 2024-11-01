import express, { Application } from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoutes';
import errorHandler from './middlewares/errorHandler';

dotenv.config(); // Mengambil variabel lingkungan dari file .env

const app: Application = express();

// Middleware CORS untuk keamanan
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Middleware untuk body parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi session untuk autentikasi sederhana
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Konfigurasi Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Management API',
      version: '1.0.0',
      description: 'API for managing books'
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts'] // Path untuk file yang berisi anotasi Swagger
};

// Inisialisasi Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Menghubungkan ke database MongoDB
connectDB();

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Error handling middleware
app.use(errorHandler);

// Menjalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

export default app;
