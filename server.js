const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

require('dotenv').config()

require('./dbconnection/mongo')

const port = process.env.PORT || 8080;

app.use(cors({
    origin : ['http://localhost:5173'],
    credentials:true
}))

app.use(express.json())

app.use(cookieParser())

app.use("/api",require("./routes/api"))
app.use("/candidate",require("./routes/candidate"))

app.get("/",(req,res)=>{
    res.send("basic route")
})

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})