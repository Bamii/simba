const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../../models/user.model.js')
const { PASSWORD_SECRET } = process.env;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PASSWORD_SECRET,
}

module.exports = new Strategy(opts, function verify({ username, email }, done) {
  User.findOne({ username, email }, function(err, user) {
     if (err) return done(err, false);

     if (user) { return done(null, user); }
     else { return done(null, false); }
 });
})
