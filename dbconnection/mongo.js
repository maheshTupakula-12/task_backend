const mongoose = require('mongoose')
require('dotenv').config()


const connection_str = process.env.connection_str;

async function dbConnection(){
    await mongoose.connect(connection_str)
    console.log("connected to db")
}

dbConnection()

process.on("uncaughtException",(err)=>{
    console.log(err.message)
})