const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const bookRoutes = require('./routes/books');
const usersRouter = require('./routes/users');
const passport = require('passport');
const session = require('express-session');
const TwitterStrategy = require('passport-twitter').Strategy;
const crypto = require('crypto');

const app = express();
const port = 4000;

// Serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  // Retrieve user from the database based on the ID
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
const sessionSecret = crypto.randomBytes(32).toString('hex');

// Middleware
app.use(express.json());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Twitter OAuth configuration
passport.use(
  new TwitterStrategy(
    {
      consumerKey: 'KNWouMHGOUVtYaKawaxd8m8JZ',
      consumerSecret: 'CbVZEYBiovKvsRHEkAFAAP3ci45GLRzAbT5vIRX6nnNlPSCUEd',
      callbackURL: 'https://library-management-api-n823.onrender.com/auth/twitter/callback',
      profileFields: ['id', 'displayName', 'username', 'email', 'photos'],
    },
    (token, tokenSecret, profile, done) => {
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        username: profile.username,
        token: token,
        tokenSecret: tokenSecret,
      };

      done(null, user);
    }
  )
);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/users', usersRouter);

// Twitter OAuth routes
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    // Save the session and redirect
    req.login(req.user, (err) => {
      if (err) {
        console.error('Error saving session:', err);
      }
      res.redirect('/');
    });
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);

  // Set the MongoDB URI
process.env.MONGODB_URI = 'mongodb+srv://nanakwamedickson:bacteria1952@cluster0.hhph3e6.mongodb.net/';
  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB', err);
    });
});