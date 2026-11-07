import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../models/books.js';
import { authorExists } from '../models/authors.js';
import { buildBook } from '../utils/validation.js';

const MONGO_DUPLICATE_KEY_ERROR = 11000;

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();

    return res.status(200).json(books);
  } catch (error) {
    console.error('Failed to retrieve books:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const book = await getBookById(requestedId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('Failed to retrieve book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createBookHandler = async (req, res) => {
  const newBook = buildBook(req.body, { requireId: true });

  if (!newBook) {
    return res.status(400).json({
      message: 'id, authorId, title, and publicationDate are required and must be valid'
    });
  }

  try {
    if (!(await authorExists(newBook.authorId))) {
      return res
        .status(400)
        .json({ message: 'authorId does not match an existing author' });
    }

    const existingBook = await getBookById(newBook.id);

    if (existingBook) {
      return res.status(409).json({ message: 'A book with this id already exists' });
    }

    await createBook(newBook);

    return res.status(201).json(newBook);
  } catch (error) {
    if (error.code === MONGO_DUPLICATE_KEY_ERROR) {
      return res.status(409).json({ message: 'A book with this id already exists' });
    }

    console.error('Failed to create book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookHandler = async (req, res) => {
  const requestedId = req.params.id;
  const bookChanges = buildBook(req.body, { requireId: false });

  if (!bookChanges) {
    return res.status(400).json({
      message: 'authorId, title, and publicationDate are required and must be valid'
    });
  }

  if (req.body.id !== undefined && req.body.id !== requestedId) {
    return res.status(400).json({ message: 'id in the body must match the id in the URL' });
  }

  try {
    if (!(await authorExists(bookChanges.authorId))) {
      return res
        .status(400)
        .json({ message: 'authorId does not match an existing author' });
    }

    const result = await updateBook(requestedId, bookChanges);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ id: requestedId, ...bookChanges });
  } catch (error) {
    console.error('Failed to update book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBookHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const result = await deleteBook(requestedId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Failed to delete book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler
};
