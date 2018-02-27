const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/env-config');
const { checkAuthentication } = require('../helper/auth');
const mongoose = require('mongoose');
const user = mongoose.model('users');


router.use(checkAuthentication);

router.route('/getUsers').get((req, res) => {
    user.find({}).select({ "name": 1 }).exec().then(items => {
        res.json(items);
    }).catch(err => {
        console.log(err);
    });
});

router.route('/transfer').post((req, res) => {
    let body = req.body;
    user.findById(body.from).then(fromUser => {
        if (body.amount > fromUser.amount) {
            res.status = 400;
            res.send('not enough money');
        };
        fromUser.amount -= body.amount;

        user.findById(body.to).then(toUser => {
            toUser.amount += body.amount;
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



module.exports = router;