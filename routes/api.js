const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/env-config');
const { checkAuthentication } = require('../helper/auth');
const mongoose = require('mongoose');
const user = mongoose.model('users');
const category = mongoose.model('category');
const _ = require('lodash');

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

router.route('/add/money').post((req, res) => {
    let body = req.body;
    user.findById(body.id).then(item => {
        item.intialAmount += body.amount;
        item.amount.push({
            category: body.category,
            money: body.amount
        });
        item.save().then(updatedItem => {
            res.json({ msg: 'money added', code: 200 });
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    });
});

router.route('/checkout').post((req, res) => {
    let body = req.body;
    user.findById(body.id).then(item => {

        let sum = getCategorySum(body.category.id, item.amount);
        if (!category) {
            res.status(401)
            return res.json({ msg: "category not found", code: 401 });
        }
        if (sum < body.amount) {
            res.status(401);
            return res.json({ msg: "not enough money", code: 401 });
        }
        else {
            item.intialAmount -= body.amount;
            category.money -= body.amount;
            item.checkout.push({
                category: body.category,
                money: body.amount
            });
        }


        item.save().then(updatedItem => {
            res.json({ msg: 'money checkedout', code: 200 });
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    });
});


function getCategorySum(categoryId, userCategoriesAmount) {
    let categories = _.filter(userCategoriesAmount, item => {
        return item.category.id == categoryId
    }).map(item=>{
        return item.money;
    });
    
    let sum=categories.reduce((a,b)=>{
        return a+b
    },0);

    return sum;
}

module.exports = router;