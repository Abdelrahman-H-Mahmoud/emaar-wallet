const router = require('express').Router();
const { checkAuthentication } = require('../helper/auth');
const mongoose = require('mongoose');
const user = mongoose.model('users');
const getCategorySum = require('../helper/categorySum');
const users = mongoose.model('users');
const _ = require('lodash');
router.use(checkAuthentication);


router.route('/add').post((req, res) => {
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
        if (!sum || isNaN(sum)) {
            res.status(400)
            return res.json({ msg: "category not found", code: 400 });
        }
        if (sum < body.amount) {
            res.status(400);
            return res.json({ msg: "not enough money", code: 400 });
        }
        else {
            item.intialAmount -= body.amount;
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

router.route('/status/:id').get((req, res) => {
    if (!req.params.id) {
        res.status(400);
        return res.json({ msg: 'invalid user Id', code: 400 });
    }
    users.findById(req.params.id).then(user => {
        var result = _(user.amount)
            .groupBy(x => x.category)
            .map((value, key) => {
                return { category: key, totalamount: _.sumBy(value, 'money') }
            }).value();
        mapResultToObject(result);
        calculateNet(result,user.checkout);
        res.json(result);
    }).catch(err => {
        console.log(err);
    });
});

function mapResultToObject(result){
    _.forEach(result,(item)=>{
        let obj={};
        let properties=item.category.split(',');
        _(properties).forEach(prop=>{
            let keyValue=prop.split(':');
            obj[keyValue[0].replace(/[\s,{,]/g,'')]=keyValue[1].replace(/[},']/g,'').trim();
        });
        item.category=obj;
    });
}

function calculateNet(result,checkout){
    _(result).forEach(item=>{
        let data=_(checkout).filter(x=>x.category.id==item.category.id).value();
        if(data){
            let sum=_(data).sumBy((obj)=>{
                return obj.money;
            });
            item.totalamount-=sum;
        }
    });
}
module.exports = router;