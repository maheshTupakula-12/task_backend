const router = require('express').Router();
const bcrypt = require('bcrypt')
const user = require('../models/users')
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')
require('dotenv').config()
router.route("/register").post(async(req,res)=>{
    const {
        firstname,
        lastname,
        email,
        password
    } =  req.body;
    if(!firstname || !lastname || !email || !password){
        return res.status(400).json({
            message:"id / firstname / lastname / email / password is missing"
        })
    }
    try{
        const salt = await bcrypt.genSalt();
        const password_hash = await bcrypt.hash(password,salt);
        const response = await user.create({
            id:uuidv4(),
            firstname,
            lastname,
            email,
            password_hash
        })
        res.status(201).json({
            message:`user registered successfully with email ${email}`
        })
    }catch(err){
        res.status(500).json({
            message:"error occured",
        })
    }
})


router.route("/login").post(async(req,res)=>{
    const {
        email,
        password
    } =  req.body;
    if(!email || !password){
        return res.status(400).json({
            message:"email / password is missing"
        })
    }
    try{
        const userInfo = await user.findOne({email});
        if(userInfo === null){
            return res.status(404).json({
                message:"user not found"
            })
        }
        const compare = await bcrypt.compare(password,userInfo.password_hash);
        if(!compare){
            return res.status(404).json({
                message:"credentials not matching"
            })
        }
        const token = jwt.sign({email},process.env.secretKey)
        res.cookie("userToken",token);
        res.json({
            message:"successfully logged in",
            userInfo
        })
    }catch(err){
        res.status(500).json({
            message:`error occured : ${err.message}`,
        })
    }
})

const authorizeUser = async(req,res,next)=>{
    const {email} = req.body;
    if(!email){
        return res.status(400).json({
            message:"email is missing"
        })
    }
    try{
        const userInfo = await user.countDocuments({email});
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
        req.user = compare; 
        next()
    }catch(err){
        console.log(err)
    }
}

router.post("/protected",authorizeUser,async(req,res)=>{
    const {email} = req.user;
    try{
        const userInfo = await user.findOne({email});
        res.json({
            userInfo
        })

    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})

router.route("/logout").get((req,res)=>{
    res.clearCookie("userToken")
    res.json({
        message:"logged out successfully"
    })
})

module.exports = router;