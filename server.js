const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/books');

const app = express();
const port = 4000;

// Middleware
app.use(express.json());

// Set the MongoDB URI
process.env.MONGODB_URI = 'mongodb+srv://nanakwamedickson:bacteria1952@cluster0.hhph3e6.mongodb.net/';

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'library',
  })
  .then(() => {
    console.log('Connected to MongoDB');

    // Routes
    app.use('/api/books', bookRoutes);

    // Start the server after successful database connection
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });