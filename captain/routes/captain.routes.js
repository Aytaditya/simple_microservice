const express=require('express');
const router=express.Router();
const captainController=require('../controllers/captain.controller');
const authMiddleware=require('../middleware/authMiddleware');

router.post('/register',captainController.register);
router.post('/login',captainController.login);
router.post('/logout',captainController.logout);
router.get('/profile',authMiddleware.authenticateCaptain,captainController.profile);
router.put('/availablity',authMiddleware.authenticateCaptain,captainController.updateAvailablity);
router.get('/rides',captainController.waitForNewRide)

module.exports=router;