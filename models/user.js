const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
//username and passport will be automatically defined by the mongoose 
//therefore we only use email in schema

const userSchema=new Schema({
    email:{
        type:String,
        requirred:true
    },

});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);