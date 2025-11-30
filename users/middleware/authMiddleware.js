const jwt=require('jsonwebtoken');
const userModel=require('../models/user.model')

module.exports.useAuth=async(req,res,next)=>{
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
        // Get token from cookies
          if (!token) {
              return res.status(401).json({message:'Unauthorized'});
          }
        const decoded=jwt.verify(token,'aditya')
        const user=await userModel.findById(decoded.userId).select('-password');
        if(!user){
            return res.status(401).json({message:'Unauthorized'});
        }
        req.user=user;
        next();
        
    } catch (error) {
        console.log("Error in auth middleware:",error);
        return res.status(401).json({message:'Unauthorized'});
    }
}
