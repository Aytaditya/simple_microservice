const userModel=require('../models/user.model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config();
const {subscribeToQueue}=require('../service/rabbit')


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

module.exports.login=async(req,res)=>{
    try {
        const{email,password}=req.body;
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const token=jwt.sign(
            {userId:user._id,email:user.email},
            jwt_secret,
            {expiresIn:'1h'}
        );
        res.cookie('token',token,{
            httpOnly:true,
            secure:false, // Set to true if using HTTPS
            maxAge:3600000 // 1 hour in milliseconds
        });
        return res.status(200).json({message:"User logged in successfully",token});
        
    } catch (error) {
        console.log("Error in user login:",error);
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('token'); // Clear the cookie
        res.status(200).json({message:'User logged out successfully'});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

module.exports.profile = async (req, res) => {
    try {
        const user = req.user; // User is already set by authMiddleware
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

module.exports.acceptedRide = async (req, res) => {
    // Long polling: wait for 'ride-accepted' event
    rideEventEmitter.once('ride-accepted', (data) => {
        res.send(data);
    });

    // Set timeout for long polling (e.g., 30 seconds)
    setTimeout(() => {
        res.status(204).send();
    }, 30000);
}

subscribeToQueue('ride-accepted', async (msg) => {
    const data = JSON.parse(msg);
    rideEventEmitter.emit('ride-accepted', data);
});
