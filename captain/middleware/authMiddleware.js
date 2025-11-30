const jwt=require('jsonwebtoken');
const captainModel=require('../models/captain.model')
const jwt_secret="aditya";

module.exports.authenticateCaptain=async(req,res,next)=>{
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    if(!token){
        return res.status(401).json({message:"Authentication token missing"});
    }
    try {
        const decoded=jwt.verify(token,jwt_secret);
        const captain=await captainModel.findById(decoded.captainId).select('-password');
        if(!captain){
            return res.status(401).json({message:"Captain not found"});
        }
        req.captain=captain;
        next();
    } catch (error) {
        return res.status(401).json({message:"Invalid or expired token"});
    }
}