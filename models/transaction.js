const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TransactionSchema = new Schema({
    from: {
        id: String,
        name: String,
    },
    to: {
        id: String,
        name: String,
    },
    category: {
        id: String,
        name: String,
    },
    amount: Number,
    description:String,
    date: Date
});

mongoose.model('transactions', TransactionSchema);