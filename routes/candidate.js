const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const candidate = require('../models/candidate')

const user = require('../models/users')

const authorizeUser = async(req,res,next)=>{
    const {user_id} = req.body;
    if(!user_id){
        return res.status(400).json({
            message:"user id is missing"
        })
    }
    try{
        const userInfo = await user.countDocuments({user_id});
        if(userInfo === null){
            return res.status(404).json({
                message:"user not found"
            })
        }
        const {userToken} = req.cookies;
        if(!userToken){
            return res.status(401).json({
                message:"user not logged in"
            })
        }
        const compare = jwt.verify(userToken,process.env.secretKey)
        if(!compare){
            return res.status(403).json({
                message:"user don't have permission"
            })
        }
        console.log(compare,"compare")
        // req.user = compare; 
        next()
    }catch(err){
        console.log(err)
    }
}


router.post("/add",authorizeUser,async(req,res)=>{
    const {
        firstname,
        lastname,
        email,
        user_id
    } =  req.body;
    try{
        await candidate.create({
            id:uuidv4(),
            firstname,
            lastname,
            email,
            user_id
        })
        res.status(201).json({
            message:`candidate created successfully with email ${email}`
        })
    }catch(err){
        res.status(500).json({
            message:`error occured ${err.message}`,
        })
    }
})


router.post("/get",authorizeUser,async(req,res)=>{
    const {
        user_id
    } =  req.body;
    try{
        const data = await candidate.find({
            user_id
        })
        res.json({
           data
        })
    }catch(err){
        res.status(500).json({
            message:`error occured ${err.message}`,
        })
    }
})


module.exports = router;