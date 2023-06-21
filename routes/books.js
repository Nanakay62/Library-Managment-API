const express = require('express');
const router = express.Router();
const { getAllBooks, createBook } = require('../controllers/books');

// GET all books
router.get('/', getAllBooks);

// POST a new book
router.post('/', createBook);

module.exports = router;