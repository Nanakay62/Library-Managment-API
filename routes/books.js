const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
} = require('../controllers/books');
const { body, validationResult } = require('express-validator');

// Validation middleware for create and update book routes
const validateBookData = [
  body('title').notEmpty().withMessage('Title is required'),
  body('year').notEmpty().withMessage('Year is required'),
  body('genre').notEmpty().withMessage('Genre is required'),
  body('writer').notEmpty().withMessage('Writer is required'),
  body('audience').notEmpty().withMessage('Audience is required'),
  body('pages').notEmpty().withMessage('Pages is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// GET all books
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', validateBookData, createBook);
router.put('/:id', validateBookData, updateBookById);
router.delete('/:id', deleteBookById);

module.exports = router;