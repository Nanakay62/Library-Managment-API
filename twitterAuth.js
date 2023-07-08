/*const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

passport.use(
  new TwitterStrategy(
    {
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
)


module.exports = passport;*/