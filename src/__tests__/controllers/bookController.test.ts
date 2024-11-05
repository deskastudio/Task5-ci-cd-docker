import { Request, Response } from 'express';
import Book from '../../models/Book'; // Pastikan nama file ini benar
import BookController from '../../controllers/bookController'; // Pastikan ini juga benar

jest.mock('../../models/Book'); // Ganti 'book' menjadi 'Book' untuk konsistensi huruf kapital

describe('BookController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {
        title: 'Test Book',
        author: 'Test Author',
        code: undefined,
        publishedDate: undefined,
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const mockBook = { ...mockRequest.body };
      (Book.create as jest.Mock).mockResolvedValueOnce(mockBook);

      await BookController.createBook(mockRequest as Request, mockResponse as Response);

      expect(Book.create).toHaveBeenCalledWith(mockBook);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
    });
  });
});
