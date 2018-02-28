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

router.route('/transfer').post((req, res) => {
    let body = req.body;
    user.findById(body.from).then(fromUser => {
        if (body.amount > fromUser.intialAmount) {
            res.status = 400;
            res.send('not enough money');
        };
        fromUser.intialAmount -= body.amount;

        user.findById(body.to).then(toUser => {
            toUser.intialAmount += body.amount;
            fromUser.transferredMoney.push({
                to: {
                    id: toUser.id,
                    name: toUser.name,
                },
                amount: body.amount,
                date: body.date || Date.now()
            });
            toUser.receivedMoney.push({
                from: {
                    id: fromUser.id,
                    name: fromUser.name,
                },
                amount: body.amount,
                date: body.date || Date.now()
            });
            fromUser.save().then(updatedFromUser => {
                toUser.save().then(updatedtoUser => {
                    res.sendStatus(200);
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
});

router.route('/add/money').post((req, res) => {
    let body = req.body;
    user.findById(body.id).then(item => {
        item.intialAmount += body.amount;

        let category = getCategory(body.category.id, item.amount);
        if (!category) {
            item.amount.push({
                category: body.category,
                money: body.amount
            });
        }
        else
            category.money += body.amount;
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

        let category = getCategory(body.category.id, item.amount);
        console.log(category);
        if (!category) {
            res.status = 401;
            return res.json({ msg: "category not found", code: 401 });
        }
        if (category.money < body.amount) {
            res.status = 401;
            return res.json({ msg: "not enough money", code: 401 });
        }
        else {
            item.intialAmount -= body.amount;
            category.money -= body.amount;
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


function getCategory(categoryId, userCategoriesAmount) {
    console.log(userCategoriesAmount);
    let category = _.find(userCategoriesAmount, item => {
        return item.category.id == categoryId
    });
    console.log(category);

    return category;
}

module.exports = router;