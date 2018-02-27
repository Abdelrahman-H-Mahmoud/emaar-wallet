const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('users');

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        User.findOne({ email: email }).then(user => {
            if (!user)
                return done({ error: "invalid username or email" }, false, { message: 'no user found' });
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    return done(null, user)
                }
                else
                    return done({ error: "invalid username or email" }, false, { message: 'invalid email or password' });
            }).catch(err => {
                done(err,null);
            })

        }).catch(err => {
            done(err,null);
        })
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}