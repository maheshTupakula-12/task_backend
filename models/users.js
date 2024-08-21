const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id :{
        type:String,
        required:true,
    },
    firstname :{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    password_hash:{
        type:String,
        required:true
    }
})

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;