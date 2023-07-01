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
const crypto = require('crypto');
const redis = require('redis');
const redisStore = require('connect-redis')(session);

const app = express();
const port = 4000;

// Serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const sessionSecret = crypto.randomBytes(32).toString('hex');

// Create a Redis client
const redisClient = redis.createClient({
  host: 'localhost', // Redis server host
  port: 6379, // Redis server port
  // Add any additional Redis configuration options if required
});

// Middleware
app.use(express.json());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new redisStore({ client: redisClient }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: '182055713047-h4o31a7p4v2rdpd3d1tlaq5a3emtpiqo.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'https://library-management-api-n823.onrender.com/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      done(null, user);
    }
  )
);

// Set the MongoDB URI
process.env.MONGODB_URI = 'mongodb+srv://nanakwamedickson:bacteria1952@cluster0.hhph3e6.mongodb.net/'; // Update with your MongoDB URI

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');

    // Serve Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Routes
    app.use('/api/books', bookRoutes);
    app.use('/api/users', usersRouter);

    // Google OAuth routes
    app.get(
      '/auth/google',
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );
    app.get(
      '/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      (req, res) => {
        // Redirect or perform any other actions after successful authentication
        res.redirect('/');
      }
    );

    // Start the server after a successful database connection
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });