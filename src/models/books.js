import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const database = getDb();

  const books = await database
    .collection('books')
    .find({}, { projection: { _id: 0 } })
    .sort({ title: 1 })
    .toArray();

  return books;
};

const getBookById = async (bookId) => {
  const database = getDb();

  const book = await database
    .collection('books')
    .findOne({ id: bookId }, { projection: { _id: 0 } });

  return book;
};

const createBook = async (book) => {
  const database = getDb();

  // Insert a copy because the driver adds an _id field to the object it receives.
  const result = await database.collection('books').insertOne({ ...book });

  return result;
};

const updateBook = async (bookId, book) => {
  const database = getDb();

  const result = await database
    .collection('books')
    .updateOne({ id: bookId }, { $set: book });

  return result;
};

const deleteBook = async (bookId) => {
  const database = getDb();

  const result = await database.collection('books').deleteOne({ id: bookId });

  return result;
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
