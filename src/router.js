import express from 'express';
import { getBooksHandler, getBookByIdHandler } from './controllers/books.js';

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - id
 *         - author
 *         - title
 *         - publicationDate
 *       properties:
 *         id:
 *           type: string
 *           example: b1
 *         author:
 *           type: string
 *           example: Maya Rivera
 *         title:
 *           type: string
 *           example: Patterns of Light
 *         publicationDate:
 *           type: string
 *           description: ISO 8601 date (YYYY-MM-DD)
 *           example: '2021-08-17'
 *     ErrorMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: A list of books, sorted by title
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

export default router;