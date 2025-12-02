const captainModel=require('../models/captain.model');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {subscribeToQueue}=require('../service/rabbit')

const jwt_secret="aditya"
const pendingRequests = [];

module.exports.register=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        const captain=await captainModel.findOne({email});
        if(captain){
            return res.status(400).json({message:"Captain already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newCaptain=new captainModel({
            name,
            email,
            password:hashedPassword
        });
        await newCaptain.save();
        const token=jwt.sign(
            {captainId:newCaptain._id,email:newCaptain.email},
            jwt_secret,
            {expiresIn:'1h'}
        );
        res.cookie('token',token,{
            httpOnly:true,
            secure:false, // Set to true if using HTTPS
            maxAge:3600000 // 1 hour in milliseconds
        });
        return res.status(201).json({message:"Captain registered successfully",token});
    } catch (error) {
        console.error("Error registering captain:",error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const captain=await captainModel.findOne({email})
        if(!captain){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const isPasswordValid=await bcrypt.compare(password,captain.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const token=jwt.sign(
            {captainId:captain._id,email:captain.email},
            jwt_secret,
            {expiresIn:'1h'}
        );
        res.cookie('token',token,{
            httpOnly:true,
            secure:false, // Set to true if using HTTPS
            maxAge:3600000 // 1 hour in milliseconds
        });
        return res.status(200).json({message:"Captain logged in successfully",token});
    } catch (error) {
        console.log("Error logging in captain:",error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports.logout=async(req,res)=>{
    try {
        res.clearCookie('token');
        return res.status(200).json({message:"Captain logged out successfully"});
    } catch (error) {
        console.log("Error logging out captain:",error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports.profile=async(req,res)=>{
    try {
        const captain=req.captain;
        return res.status(200).json(captain);
    } catch (error) {
        console.log("Error fetching captain profile:",error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports.updateAvailablity=async(req,res)=>{
    try {
        const captainId=req.captain._id;
        const {isAvailable}=req.body;
        const captain=await captainModel.findByIdAndUpdate(
            captainId,
            {isAvailable},
            {new:true}
        ).select('-password');
        return res.status(200).json({message:"Availability updated successfully",captain});
    } catch (error) {
        console.log("Error updating availability:",error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports.waitForNewRide = async (req, res) => {
    // Set timeout for long polling
    req.setTimeout(30000, () => {
        res.status(204).end(); // No Content
    });

    // Add the response object to the pendingRequests array
    pendingRequests.push(res);
}

subscribeToQueue("new-ride", (data) => {
    const rideData = JSON.parse(data);

    // Send the new ride data to all pending requests
    pendingRequests.forEach(res => {
        res.json(rideData);
    });

    // Clear the pending requests
    pendingRequests.length = 0;
});