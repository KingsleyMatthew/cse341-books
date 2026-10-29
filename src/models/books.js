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

export { getAllBooks };