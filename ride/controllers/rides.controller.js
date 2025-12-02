const rideModel=require('../models/ride.models')

module.exports.createRide=async(req,res)=>{
    try {
        const user=req.user
        // return res.status(200).json(user);
        const {pickup,destination}=req.body
        const newRide=new rideModel({
            user:user._id,
            pickup,
            destination
        })
        await newRide.save()
        // now we have to use message notifcation system to inform captains about new ride request
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}