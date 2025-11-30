const userModel=require('../models/user.model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config();


const jwt_secret="aditya"


module.exports.register= async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        console.log(name,email,password);
        const user=await userModel.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new userModel({
            name,
            email,
            password:hashedPassword
        });
        await newUser.save();
        const token=jwt.sign(
            {userId:newUser._id, email:newUser.email},
            jwt_secret,
            {expiresIn:'1h'}
        );
        res.cookie('token',token,{
            httpOnly:true,
            secure:false, // Set to true if using HTTPS
            maxAge: 3600000 // 1 hour in milliseconds
        });
        return res.status(201).json({message:"User registered successfully", token});
    } catch (error) {
        console.log("Error in user registration:",error);
        return res.status(500).json({message:"Internal server error"});
    }
}
