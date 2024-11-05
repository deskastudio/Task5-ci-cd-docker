import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Error status:', err.statusCode);
  
  const statusCode = err.statusCode ?? 500;
  
  return res.status(statusCode).json({
    message: err.message
  });
};
