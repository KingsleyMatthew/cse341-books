import express from 'express';
import {
  getAuthorsHandler,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler
} from './controllers/authors.js';
import {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler
} from './controllers/books.js';

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - birthYear
 *       properties:
 *         id:
 *           type: string
 *           example: a1
 *         name:
 *           type: string
 *           example: Maya Rivera
 *         birthYear:
 *           type: integer
 *           description: Whole number from 1 to the current year
 *           example: 1985
 *     AuthorUpdate:
 *       type: object
 *       required:
 *         - name
 *         - birthYear
 *       properties:
 *         id:
 *           type: string
 *           description: Optional. If included, it must match the id in the URL.
 *           example: a4
 *         name:
 *           type: string
 *           example: Lena Hoffmann-Reyes
 *         birthYear:
 *           type: integer
 *           example: 1982
 *     Book:
 *       type: object
 *       required:
 *         - id
 *         - authorId
 *         - title
 *         - publicationDate
 *       properties:
 *         id:
 *           type: string
 *           example: b1
 *         authorId:
 *           type: string
 *           description: The id of an existing author
 *           example: a1
 *         title:
 *           type: string
 *           example: Patterns of Light
 *         publicationDate:
 *           type: string
 *           description: ISO 8601 date (YYYY-MM-DD)
 *           example: '2021-08-17'
 *     BookUpdate:
 *       type: object
 *       required:
 *         - authorId
 *         - title
 *         - publicationDate
 *       properties:
 *         id:
 *           type: string
 *           description: Optional. If included, it must match the id in the URL.
 *           example: b4
 *         authorId:
 *           type: string
 *           example: a2
 *         title:
 *           type: string
 *           example: Updated Book Title
 *         publicationDate:
 *           type: string
 *           example: '2026-02-20'
 *     ErrorMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     description: Returns all authors sorted by name.
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: A list of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Internal server error
 */
router.get('/authors', getAuthorsHandler);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Get one author by id
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom id of the author (for example, a1)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Author not found
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Internal server error
 */
router.get('/authors/:id', getAuthorByIdHandler);

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Create an author
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *           example:
 *             id: a4
 *             name: Lena Hoffmann
 *             birthYear: 1982
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid JSON, or a required field is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: id, name, and birthYear are required and must be valid
 *       409:
 *         description: An author with this id already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: An author with this id already exists
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Internal server error
 */
router.post('/authors', createAuthorHandler);

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     summary: Update an author
 *     description: Replaces the author's name and birth year. Both fields are required.
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom id of the author to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorUpdate'
 *           example:
 *             name: Lena Hoffmann-Reyes
 *             birthYear: 1982
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid JSON, missing or invalid field, or body id does not match the URL id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: name and birthYear are required and must be valid
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Author not found
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Internal server error
 */
router.put('/authors/:id', updateAuthorHandler);

/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     description: Deletes an author only if no book still references them.
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom id of the author to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Author deleted successfully (no response body)
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Author not found
 *       409:
 *         description: Author still has books and cannot be deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Author still has books and cannot be deleted
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Internal server error
 */
router.delete('/authors/:id', deleteAuthorHandler);

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     description: Returns all books sorted by title.
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Internal server error
 */
router.get('/books', getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get one book by id
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom id of the book (for example, b1)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Book not found
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Internal server error
 */
router.get('/books/:id', getBookByIdHandler);

/**
 * @openapi
 * /books:
 *   post:
 *     summary: Create a book
 *     description: The authorId must match an existing author.
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *           example:
 *             id: b4
 *             authorId: a1
 *             title: Example Book Title
 *             publicationDate: '2026-01-15'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid JSON, a required field is missing or invalid, or authorId does not match an existing author
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: authorId does not match an existing author
 *       409:
 *         description: A book with this id already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: A book with this id already exists
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Internal server error
 */
router.post('/books', createBookHandler);

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     description: Replaces the book's authorId, title, and publicationDate. All three are required.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom id of the book to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdate'
 *           example:
 *             authorId: a2
 *             title: Updated Book Title
 *             publicationDate: '2026-02-20'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid JSON, missing or invalid field, body id does not match the URL id, or authorId does not match an existing author
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: authorId does not match an existing author
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Book not found
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Internal server error
 */
router.put('/books/:id', updateBookHandler);

/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom id of the book to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Book deleted successfully (no response body)
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Book not found
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Internal server error
 */
router.delete('/books/:id', deleteBookHandler);

export default router;
