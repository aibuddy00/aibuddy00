import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || ''
  },
  function(accessToken: string, refreshToken: string, profile: any, cb: any) {
    // Here you would find or create a user in your database
    // For now, we'll just pass the profile
    return cb(null, profile);
  }
));

export default passport;