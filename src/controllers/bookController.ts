import { Request, Response } from 'express';
import Book, { IBook } from '../models/Book';

// Fungsi untuk membuat buku baru
const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, code, author, publishedDate } = req.body;

    // Validasi duplikasi berdasarkan title atau code
    const existingBook = await Book.findOne({ $or: [{ title }, { code }] });
    if (existingBook) {
      console.log('Error: Book with the same title or code already exists.');
      res.status(400).json({ message: 'Book with the same title or code already exists.' });
      return;
    }

    const book = new Book({ title, code, author, publishedDate });
    await book.save();
    console.log('Success: Book created successfully', book);
    res.status(201).json(book);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to create book:', errorMessage);
    res.status(500).json({ message: 'Failed to create book', error: errorMessage });
  }
};

// Fungsi untuk mendapatkan semua buku
const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find();
    console.log('Success: Books fetched successfully');
    res.status(200).json(books);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch books:', errorMessage);
    res.status(500).json({ message: 'Failed to fetch books', error: errorMessage });
  }
};

// Fungsi untuk mendapatkan detail buku berdasarkan ID
const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      console.log('Error: Book not found');
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    console.log('Success: Book fetched successfully', book);
    res.status(200).json(book);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch book:', errorMessage);
    res.status(500).json({ message: 'Failed to fetch book', error: errorMessage });
  }
};

// Fungsi untuk memperbarui buku berdasarkan ID
const updateBook = async (req: Request, res: Response): Promise<void> => {
  const { title, code, author, publishedDate } = req.body;
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, code, author, publishedDate },
      { new: true, runValidators: true }
    );
    if (!book) {
      console.log('Error: Book not found');
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    console.log('Success: Book updated successfully', book);
    res.status(200).json(book);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to update book:', errorMessage);
    res.status(500).json({ message: 'Failed to update book', error: errorMessage });
  }
};

// Fungsi untuk menghapus buku berdasarkan ID
const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      console.log('Error: Book not found');
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    console.log('Success: Book deleted successfully');
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to delete book:', errorMessage);
    res.status(500).json({ message: 'Failed to delete book', error: errorMessage });
  }
};

// Mengelompokkan semua fungsi dalam satu objek
class BookController {
  static async createBook(req: Request, res: Response) {
      try {
          const newBook = await Book.create(req.body);
          return res.status(201).json(newBook);
      } catch (error: any) {
          return res.status(500).json({ message: error.message });
      }
  }
}

export default BookController;
