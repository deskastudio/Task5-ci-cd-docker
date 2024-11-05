import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authenticateToken from '../../middlewares/authMiddleware';

jest.mock('jsonwebtoken');

describe('AuthMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {
        authorization: 'Bearer mockToken'
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should validate token', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'user123' });
    
    await authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 401 for invalid token', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    await authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });
}); 