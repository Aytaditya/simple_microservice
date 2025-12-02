const rideModel=require('../models/ride.models')
const {subscribeToQueue,publishToQueue}=require('../service/rabbit')

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
        publishToQueue("new-ride",JSON.stringify(newRide))  // now we have to use message notifcation system to inform captains about new ride request
        return res.status(201).json({message:"Ride created successfully",ride:newRide});
    } catch (error) {
        console.log("Error creating ride:",error);
        return res.status(500).json({message:error.message});
    }
}

module.exports.acceptRide=async(req,res)=>{
    try {
        const { rideId } = req.query;
        const ride = await rideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
    
        ride.status = 'accepted';
        await ride.save();
        publishToQueue("ride-accepted", JSON.stringify(ride))
        return res.status(200).json({message:"Ride accepted successfully",ride});
    } catch (error) {
        console.log("Error accepting ride:",error);
        return res.status(500).json({message:error.message});
    }
}

