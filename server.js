const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const bookRoutes = require('./routes/books');
const usersRouter = require('./routes/users');
const passport = require('passport');
const session = require('express-session');
const twitterAuthStrategy = require('./twitterAuth');
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

// The authentication strategy
passport.use('twitter-auth', twitterAuthStrategy); // Updated authentication strategy

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

    // Twitter OAuth routes
    app.get('/auth/twitter', passport.authenticate('twitter-auth')); // Updated authentication route
    app.get(
      '/auth/twitter/callback',
      passport.authenticate('twitter-auth', { failureRedirect: '/login' }),
      (req, res) => {
        // Redirect or perform any other actions after successful authentication
        res.redirect('/');
      }
    );

    // Redirect HTTP to HTTPS
    app.use((req, res, next) => {
      if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === 'http') {
        // If the request is made over HTTP, redirect to HTTPS
        res.redirect(`https://${req.headers.host}${req.url}`);
      } else {
        // If the request is already secure (HTTPS) or the 'x-forwarded-proto' header is missing, proceed to the next middleware
        next();
      }
    });

    // Start the server after a successful database connection
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });