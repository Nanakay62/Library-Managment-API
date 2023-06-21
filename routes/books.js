const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById, createBook } = require('../controllers/books');

// GET all books
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', createBook);

module.exports = router;