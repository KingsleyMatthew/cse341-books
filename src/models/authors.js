import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const database = getDb();

  const authors = await database
    .collection('authors')
    .find({}, { projection: { _id: 0 } })
    .sort({ name: 1 })
    .toArray();

  return authors;
};

const getAuthorById = async (authorId) => {
  const database = getDb();

  const author = await database
    .collection('authors')
    .findOne({ id: authorId }, { projection: { _id: 0 } });

  return author;
};

const authorExists = async (authorId) => {
  const database = getDb();

  const author = await database
    .collection('authors')
    .findOne({ id: authorId }, { projection: { _id: 1 } });

  return Boolean(author);
};

const createAuthor = async (author) => {
  const database = getDb();

  // Insert a copy because the driver adds an _id field to the object it receives.
  const result = await database.collection('authors').insertOne({ ...author });

  return result;
};

const updateAuthor = async (authorId, author) => {
  const database = getDb();

  const result = await database
    .collection('authors')
    .updateOne({ id: authorId }, { $set: author });

  return result;
};

const deleteAuthor = async (authorId) => {
  const database = getDb();

  const result = await database.collection('authors').deleteOne({ id: authorId });

  return result;
};

const authorHasBooks = async (authorId) => {
  const database = getDb();

  const bookCount = await database
    .collection('books')
    .countDocuments({ authorId }, { limit: 1 });

  return bookCount > 0;
};

export {
  getAllAuthors,
  getAuthorById,
  authorExists,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
};
