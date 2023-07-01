const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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
      };
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;

      done(null, user);
    }
  )
);

module.exports = passport;