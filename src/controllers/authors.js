import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
} from '../models/authors.js';
import { buildAuthor } from '../utils/validation.js';

const MONGO_DUPLICATE_KEY_ERROR = 11000;

const getAuthorsHandler = async (req, res) => {
  try {
    const authors = await getAllAuthors();

    return res.status(200).json(authors);
  } catch (error) {
    console.error('Failed to retrieve authors:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAuthorByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const author = await getAuthorById(requestedId);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('Failed to retrieve author:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createAuthorHandler = async (req, res) => {
  const newAuthor = buildAuthor(req.body, { requireId: true });

  if (!newAuthor) {
    return res
      .status(400)
      .json({ message: 'id, name, and birthYear are required and must be valid' });
  }

  try {
    const existingAuthor = await getAuthorById(newAuthor.id);

    if (existingAuthor) {
      return res.status(409).json({ message: 'An author with this id already exists' });
    }

    await createAuthor(newAuthor);

    return res.status(201).json(newAuthor);
  } catch (error) {
    if (error.code === MONGO_DUPLICATE_KEY_ERROR) {
      return res.status(409).json({ message: 'An author with this id already exists' });
    }

    console.error('Failed to create author:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAuthorHandler = async (req, res) => {
  const requestedId = req.params.id;
  const authorChanges = buildAuthor(req.body, { requireId: false });

  if (!authorChanges) {
    return res
      .status(400)
      .json({ message: 'name and birthYear are required and must be valid' });
  }

  if (req.body.id !== undefined && req.body.id !== requestedId) {
    return res.status(400).json({ message: 'id in the body must match the id in the URL' });
  }

  try {
    const result = await updateAuthor(requestedId, authorChanges);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json({ id: requestedId, ...authorChanges });
  } catch (error) {
    console.error('Failed to update author:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAuthorHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const author = await getAuthorById(requestedId);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    if (await authorHasBooks(requestedId)) {
      return res
        .status(409)
        .json({ message: 'Author still has books and cannot be deleted' });
    }

    const result = await deleteAuthor(requestedId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Failed to delete author:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getAuthorsHandler,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler
};
