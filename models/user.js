const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: String,
    password: String,
    email: String,
    isFirstTime: Boolean,
    amount: [{
        category: {
            id: String,
            name: String,
        },
        date: {
            type: Date,
            default: Date.now
        },
        money: Number
    }],
    checkout: [{
        category: {
            id: String,
            name: String
        },
        date: {
            type: Date,
            default: Date.now
        },
        money: Number
    }],
    intialAmount: Number,
    role: String
});

mongoose.model('users', UserSchema);