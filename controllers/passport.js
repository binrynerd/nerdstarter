const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");
// Using local stratagy
module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match User
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Email is not registered" });
          }
          else{
            // Match Password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect Password" });
            }
          });
          }
        })
        .catch((err) => console.log(err));
    })
  );

// passport-google-oauth2 strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/google/callback",
  passReqToCallback: true
},
function(request, accessToken, refreshToken, profile, done) {
  // check if user already exists in database
  User.findOne({ 'google.id': profile.id }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    } else {
      // create new user in database
      const newUser = new User({
        google: {
          id: profile.id,
          email: profile.email,
          name: profile.displayName
        }
      });
      newUser.save()
        .then(user => {
          done(null, user);
        })
        .catch(err => {
          done(err, null);
        });
    }
  });
}
));


// serialize and deserialize user for local strategy
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// serialize and deserialize user for Google strategy
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

};




