const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/env-config');
const { checkAuthentication } = require('../helper/auth');
const mongoose = require('mongoose');
const user = mongoose.model('users');
const Transaction = mongoose.model('transactions');

router.use(checkAuthentication);
router.route('/received/:id').get((req, res) => {
    let id = req.params.id;
    user.findById(id).select({ "_id": 0, "receivedMoney": 1 }).exec().then(items => {
        res.json(items);
    }).catch(err => {
        console.log(err);
    });
});

router.route('/transferred/:id').get((req, res) => {
    let id = req.params.id;
    user.findById(id).select({ "_id": 0, "transferredMoney": 1 }).exec().then(items => {
        res.json(items);
    }).catch(err => {
        console.log(err);
    });
});


router.route('/transfer').post((req, res) => {
    let body = req.body;
    user.findById(body.from).then(fromUser => {
        if (body.amount > fromUser.intialAmount) {
            res.status(400);
            res.send('not enough money');
        };
        fromUser.intialAmount -= body.amount;
        user.findById(body.to).then(toUser => {
            toUser.intialAmount += body.amount;
            let tran = new Transaction({
                from: {
                    id: fromUser.id,
                    name: fromUser.name
                },
                to: {
                    id: toUser.id,
                    name: toUser.name,
                },
                category:body.category || {},
                amount: body.amount,
                description:body.description || "",
                date: body.date || Date.now()
            });
            fromUser.save().then(updatedFromUser => {
                toUser.save().then(updatedtoUser => {
                    tran.save().then(savedTransaction => {
                        res.json({ msg: "money transferred", code: 200, data: savedTransaction });
                    }).catch(err => { console.log(err); });
                }).catch(err => {
                    console.log(err);
                });
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

module.exports = router;