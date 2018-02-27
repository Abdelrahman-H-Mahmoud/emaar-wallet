const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const user = mongoose.model('users');

router.route('/register').post((req, res) => {
    if(!checkBody(req.body))
        res.sendStatus(400);
    bcrypt.genSalt(10, (err, salt) => {
        let pass=req.body.password
        bcrypt.hash(pass, salt, (err, hash) => {
            if (err) throw err;
            let newUser = new user({
                name: req.body.name || req.body.email,
                password: hash,
                email: req.body.email,
                isFirstTime: true,
                amount: req.body.amount || 0,
                role: req.body.role || 'member'
            });
            newUser.password = hash;
            newUser.save().then(user => {
                console.log(user);
                res.status(201);
                res.json({msg:'User Create',code:201});
            }).catch(err => {
                console.log(err);
            });
        });

    });
    
});

function checkBody(body){
    if(!body)
        return false;
    if(!body.password || !body.email)
        return false;
    
    return true;
}

module.exports=router;