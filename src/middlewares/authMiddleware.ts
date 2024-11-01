import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Definisikan tipe payload dari JWT
interface JwtPayload {
  id: string;
  username: string;
}

// Definisikan tipe AuthRequest yang mengandung user dari decoded JWT
interface AuthRequest extends Request {
  user?: JwtPayload;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token provided.' });
    return;
  }

  try {
    // Verifikasi token dan cast hasil verifikasi ke JwtPayload
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded; // Simpan user di req agar bisa digunakan di endpoint
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
