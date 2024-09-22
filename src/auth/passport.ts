import passport from 'passport';
import './googleStrategy';
import './twitterStrategy';
import './linkedinStrategy';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});

export default passport;