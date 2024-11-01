// src/controllers/authController.ts

import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Register Controller - Untuk mendaftarkan pengguna baru
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Cek apakah username sudah ada di database
    const existingUser: IUser | null = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: 'Username already taken' });
      return;
    }

    // Buat user baru dan simpan ke database
    const newUser = new User({ username, password });
    await newUser.save(); // Password akan di-hash oleh pre-save hook di model User

    // Buat token JWT setelah registrasi berhasil
    const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * Login Controller - Untuk masuk ke akun pengguna
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: 'Invalid username or password.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid username or password.' });
      return;
    }

    // Buat token JWT untuk pengguna yang berhasil login
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};
