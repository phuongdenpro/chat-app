const userControllers = require('../controllers/userControllers');
const User = require('../models/user');
const router  = require('express').Router();
const middlewareController = require('../controllers/middlewareController')


//UPDATE USER
router.put('/:id',userControllers.updateUser);

//UPDATE PASSWORD
router.put('/password/:id',userControllers.updatePassword);

//DELETE USER 
router.delete('/:id',middlewareController.verifyAdminOwner,userControllers.deleteUser);

//FIND AN USER
router.get('/:id',userControllers.getUser);

//FIND USER BY PHONENUMBER
router.get('/phonenumber/:phoneNumber',userControllers.getUserByPhoneNumber);

//FIND USERS 
router.get('/',middlewareController.verifyToken,userControllers.getUsers);

// ADD USER 
router.post('/',userControllers.addUser);


module.exports  = router;