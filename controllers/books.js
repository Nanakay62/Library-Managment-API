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

  // UPDATE a book by ID, using the PUT functions
const updateBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, year, genre, writer, audience, pages } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { title, year, genre, writer, audience, pages },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE a book by ID using the deleteByBookID constant and an Ajax request.
const deleteBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndRemove(bookId);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Exporting all functions to the main server where it would be called.
module.exports = { getAllBooks, createBook, getBookById, updateBookById,deleteBookById };