const Book = require('../model/Books');

// GET all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBookById = async (req, res) => {
    try {
      const bookId = req.params.id;
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
 
  
// POST a new book
const createBook = async (req, res) => {
    try {
      const { title, year, genre, writer, audience, pages } = req.body;
      const book = new Book({ title, year, genre, writer, audience, pages });
      await book.save();
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ error: 'Invalid data' });
    }
  };

module.exports = { getAllBooks, createBook, getBookById };