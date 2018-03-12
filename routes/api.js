const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/env-config');
const { checkAuthentication } = require('../helper/auth');
const mongoose = require('mongoose');
const user = mongoose.model('users');
const category = mongoose.model('category');
const getCategorySum=require('../helper/categorySum');


router.use(checkAuthentication);

router.route('/getUsers').get((req, res) => {
    user.find({}).select({ "name": 1 }).exec().then(items => {
        res.json(items);
    }).catch(err => {
        console.log(err);
    });
});

router.route('/getCategories').get((req, res) => {
    category.find({}).select({ "name": 1 }).exec().then(items => {
        res.json(items);
    }).catch(err => {
        console.log(err);
    });
});


module.exports = router;