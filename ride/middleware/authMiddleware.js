const jwt=require('jsonwebtoken')
const axios=require('axios')

const jwt_secret="aditya"

module.exports.userAuth=async(req,res,next)=>{
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    if(!token){
        return res.status(401).json({message:"Authentication token missing"});
    }
    const decoded=jwt.verify(token,jwt_secret);
    const response=await axios.get("http://localhost:3000/users/profile",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    console.log(response.data);
    const user=response.data;
    if(!user){
        return res.status(401).json({message:"User not found"});
    }
    req.user=user;
    next();
        
    } catch (error) {
        console.log("Error in user authentication middleware:",error);
        return res.status(500).json({message:error.message});
    }
}

module.exports.captainAuth=async(req,res,next)=>{
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    if(!token){
        return res.status(401).json({message:"Authentication token missing"});
    }
    const decoded=jwt.verify(token,jwt_secret);
    const response=await axios.get("http://localhost:3000/captains/profile",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    console.log(response.data);
    const captain=response.data;
    if(!captain){
        return res.status(401).json({message:"Captain not found"});
    }
    req.captain=captain;
    next();
        
    } catch (error) {
        console.log("Error in captain authentication middleware:",error);
        return res.status(500).json({message:error.message});
    }
}