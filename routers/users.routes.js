const express = require('express')
const router = express.Router()
const User = require('../models/users.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

//login
router.post('/login',async(req,res)=>{
    try {
        const {username,password} = req.body
        const user = await User.findOne({username})
        if(!user) return res.status(401).json({message:'User not Found.'})
        const isMatched = await bcrypt.compare(password,user.password)
        if(!isMatched) return res.status(403).json({message:'Invalid Credentials.'})
        const token = jwt.sign({userId:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn:'1h'})
        res.json({token})

    } catch (error) { 
        res.status(500).json({message:error.message})
    }
})

//register
router.post('/register',async(req,res)=>{
    try {
        const {username,email,password}=req.body
        const existingUser = await User.findOne({$or:[{username},{email}]})//i have to check username or email can passed without as object.
        if(existingUser) return res.status(400).json({message:'Username or email exists already.'})
        const hashPassword = await bcrypt.hash(password,10)
        const user = await User.insertOne({username,email,password:hashPassword})
        res.json(user)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

//logout
router.post('/logout',async(req,res)=>{
  res.json({message:"Loged out successfully."})  
})

module.exports = router