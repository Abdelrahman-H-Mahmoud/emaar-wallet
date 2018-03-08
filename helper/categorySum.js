const _ = require('lodash');
let getCategorySum= function getCategorySum(categoryId, userCategoriesAmount) {
    let categories = _.filter(userCategoriesAmount, item => {
        return item.category.id == categoryId
    }).map(item=>{
        return item.money;
    });
    
    let sum=categories.reduce((a,b)=>{
        return a+b
    },0);

    return sum;
};

module.exports=getCategorySum;