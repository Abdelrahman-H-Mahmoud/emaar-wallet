const mongose = require('mongoose');
let config = require('../config/env-config');
module.exports = function connectToDb() {
    mongose.Promise = global.Promise;
    mongose.connect(config.databaseConnection).then(() => {
        console.log('database connected');
    }).catch(err => {
        console.log(err);
    });
    require('../models/user');
    require('../models/category');
}