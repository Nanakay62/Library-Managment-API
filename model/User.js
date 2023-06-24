const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  favoriteColor: { type: String },
  birthday: { type: Date },
  favoriteGenre: { type: String },
  favoriteAuthor: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;