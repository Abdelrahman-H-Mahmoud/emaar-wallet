const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/env-config');
const { checkAuthentication } = require('../helper/auth');
const mongoose = require('mongoose');
const user = mongoose.model('users');
const bcrypt = require('bcryptjs');


router.post('/authenticate', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            res.status(401);
            return res.json({ msg: "invalid username or password", code: 401 });
        }
        if (!user) { 
            res.status(401);
            return res.json({ msg: "invalid username or password", code: 401 });
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            let user = {
                "id": req.user.id,
                "name": req.user.name,
                "role": req.user.role,
                "isFirstTime": req.user.isFirstTime,
                "amount": req.user.intialAmount
            };
            let token = jwt.sign({ "id": req.user.id, "date": Date.now() }, config.secret, { expiresIn: 24 * 60 * 60 });

            return res.json({
                user: user,
                token: token
            });
        });
    })(req, res, next);
});


router.route('/logout').get(checkAuthentication, (req, res, next) => {
    req.logOut();
    res.json({ msg: 'logged out', code: 200 });
});

router.route('/changepassword').post(checkAuthentication, (req, res) => {
    let body = req.body;
    user.findById(body.id).then(item => {
        bcrypt.compare(body.password, item.password).then(isMatch => {
            if (isMatch && passwordMatch(body.newPassword, body.confirmPassword)) {
                bcrypt.genSalt(10).then(salt => {
                    bcrypt.hash(body.newPassword, salt).then(hashed => {
                        item.password = hashed;
                        item.isFirstTime = false;
                        item.save().then(updatedUser => {
                            req.logOut();
                            res.json({ msg: 'password changed', code: 200 });
                        })
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            }
            else {
                res.status(401);
                res.json({ msg: 'invalid password', code: 401 });
            }

        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    });
});


function passwordMatch(password, confirmPassword) {
    return password == confirmPassword ? true : false;
}

module.exports = router;