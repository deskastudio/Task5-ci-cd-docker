import mongoose from 'mongoose';
import { connectDB } from '../../config/db';

jest.mock('mongoose');

describe('Database Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console methods untuk menghindari log saat testing
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should connect to database successfully', async () => {
    (mongoose.connect as jest.Mock).mockResolvedValue(undefined);
    
    await expect(connectDB()).resolves.not.toThrow();
    expect(console.log).toHaveBeenCalledWith('MongoDB connected successfully');
  });

  it('should handle connection error', async () => {
    const mockError = new Error('Connection failed');
    (mongoose.connect as jest.Mock).mockRejectedValue(mockError);
    
    await expect(connectDB()).rejects.toThrow('Connection failed');
    expect(console.error).toHaveBeenCalledWith('MongoDB connection failed:', mockError);
  });
}); 