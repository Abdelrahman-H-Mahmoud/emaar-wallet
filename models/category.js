const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let CategorySchema=new Schema({
    name:String
});

mongoose.model('category',CategorySchema);