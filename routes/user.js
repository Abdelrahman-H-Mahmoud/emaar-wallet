const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/env-config');
const { checkAuthentication } = require('../helper/auth');
const mongoose = require('mongoose');
const user = mongoose.model('users');
const bcrypt = require('bcryptjs');

router.route('/authenticate').post(passport.authenticate('local'), (req, res, next) => {
    let user = {
        "id": req.user.id,
        "name":req.user.name,
        "role":req.user.role,
        "isFirstTime":req.user.isFirstTime,
        "amount":req.user.intialAmount
    };
    let token = jwt.sign({"id":req.user.id,"date":Date.now()}, config.secret, { expiresIn: 24 * 60 * 60 });

    res.json({
        user: user,
        token: token
    });
});

router.route('/logout').get(checkAuthentication, (req, res, next) => {
    req.logOut();
    res.json({msg:'logged out',code:200});
});

router.route('/changepassword').post(checkAuthentication,(req,res)=>{
    let body=req.body;
    user.findById(body.id).then(item=>{
        bcrypt.compare(body.password, item.password).then(isMatch => {
            if (isMatch && passwordMatch(body.newPassword,body.confirmPassword)) {
                bcrypt.genSalt(10).then(salt=>{
                    bcrypt.hash(body.newPassword,salt).then(hashed=>{
                        item.password=hashed;
                        item.isFirstTime=false;
                        item.save().then(updatedUser=>{
                            req.logOut();
                            res.json({msg:'password changed',code:200});
                        })
                    }).catch(err=>{
                        console.log(err);
                    })
                }).catch(err=>{
                    console.log(err);
                })
            }
            else{
                res.status(401);
                res.json({msg:'invalid password',code:401});
            }
                
        }).catch(err => {
            console.log(err);
        })
    }).catch(err=>{
        console.log(err);
    });
});


function passwordMatch(password,confirmPassword){
    return password==confirmPassword?true:false;
}

module.exports = router;