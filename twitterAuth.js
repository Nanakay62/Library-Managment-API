/*const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

passport.use(
  new TwitterStrategy(
    {
      consumerKey: 'KNWouMHGOUVtYaKawaxd8m8JZ',
      consumerSecret: 'CbVZEYBiovKvsRHEkAFAAP3ci45GLRzAbT5vIRX6nnNlPSCUEd',
      callbackURL: 'https://library-management-api-n823.onrender.com/auth/twitter/callback',
    },
    (token, tokenSecret, profile, done) => {
      const user = {
        id: profile.id,
        displayName: profile.displayName,
      };
      user.token = token;
      user.tokenSecret = tokenSecret;

      done(null, user);
    }
  )
);

module.exports = passport;*/