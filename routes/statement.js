const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/env-config');
const { checkAuthentication } = require('../helper/auth');
const mongoose = require('mongoose');
const user = mongoose.model('users');

router.use(checkAuthentication);
router.route('/received/:id').get((req,res)=>{
    let id=req.params.id;
    user.findById(id).select({"_id":0,"receivedMoney":1}).exec().then(items=>{
        res.json(items);
    }).catch(err=>{
        console.log(err);
    });
});

router.route('/transferred/:id').get((req,res)=>{
    let id=req.params.id;
    user.findById(id).select({"_id":0,"transferredMoney":1}).exec().then(items=>{
        res.json(items);
    }).catch(err=>{
        console.log(err);
    });
});

module.exports = router;