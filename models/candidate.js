const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({
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
    user_id:{
        type:String,
        required:true,
    }
})

const candidateModel = mongoose.model('candidate',candidateSchema);

module.exports = candidateModel;