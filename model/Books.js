const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: {type: String, required: true},
  genre: { type: String, required: true },
  writer: { type: String, required: true },
  audience: { type: String, required: true },
  pages: { type: String, required: true },
});

module.exports = mongoose.model('Book', bookSchema);