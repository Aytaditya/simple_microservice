const express=require('express')
const router=express.Router();
const rideController=require('../controllers/rides.controller')
const authMiddleware=require('../middleware/authMiddleware')

router.post('/create-ride',authMiddleware.userAuth,rideController.createRide)  //ride can only be created by user
router.put('/accept-ride',authMiddleware.captainAuth,rideController.acceptRide) // ride can only be accepted by captain

module.exports=router;