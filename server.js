const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const bookRoutes = require('./routes/books');
const usersRouter = require('./routes/users');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const crypto = require('crypto');
const User = require('./model/User');
const MongoDBStore = require('connect-mongodb-session')(session);



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

// MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});

// Catch session store errors
store.on('error', (error) => {
  console.error('Session store error:', error);
});

// Middleware
app.use(express.json());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: store, // Use the MongoDB session store
  })
);
app.use(passport.initialize());
app.use(passport.session());



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
      callbackURL: 'https://library-management-api-n823.onrender.com/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        // Add other relevant information from the profile if needed
      };
      return done(null, user);
    }
  )
);
// Twitter OAuth configuration
/*passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.consumerKey,
      consumerSecret: process.env.consumerSecret,
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

      return done(null, user);
    }
  )
);*/

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/users', usersRouter);

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
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

// Twitter OAuth routes
/*app.get('/auth/twitter', passport.authenticate('twitter'));
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
*/
// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);

  // Set the MongoDB URI

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