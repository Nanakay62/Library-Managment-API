const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const bookRoutes = require('./routes/books');
const usersRouter = require('./routes/users');
const passport = require('passport');
const session = require('express-session');
const googleAuthStrategy = require('./googleAuth');

const app = express();
const port = 4000;

// Serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware
app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Use the authentication strategy with a name
passport.use('google-auth', googleAuthStrategy);

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

    // Serve Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Routes
    app.use('/api/books', bookRoutes);
    app.use('/api/users', usersRouter);
    
    // Google OAuth routes
    app.get('/auth/google', passport.authenticate('google-auth', { scope: ['profile', 'email'] }));
    app.get(
      '/auth/google/callback',
      passport.authenticate('google-auth', { failureRedirect: '/login' }),
      (req, res) => {
        // Redirect or perform any other actions after successful authentication
        res.redirect('/');
      }
    );

    // Redirect HTTP to HTTPS
    app.use((req, res, next) => {
      if (req.secure) {
        // If request is already secure (HTTPS), proceed to the next middleware
        next();
      } else {
        // Redirect HTTP request to HTTPS
        res.redirect(`https://${req.headers.host}${req.url}`);
      }
    });

    // Start the server after successful database connection
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });