import { Strategy as TwitterStrategy } from 'passport-twitter';
import passport from 'passport';

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY || '',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || '',
    callbackURL: process.env.TWITTER_CALLBACK_URL || ''
  },
  function(token: string, tokenSecret: string, profile: any, cb: any) {
    // Here you would find or create a user in your database
    // For now, we'll just pass the profile
    return cb(null, profile);
  }
));

export default passport;