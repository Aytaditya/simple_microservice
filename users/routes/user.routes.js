const express=require('express');
const router=express.Router();
const userController=require('../controllers/user.controller')
const userMiddleware=require('../middleware/authMiddleware');

router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/logout',userController.logout)
router.get('/profile',userMiddleware.useAuth,userController.profile)

module.exports=router;