// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const { verifyToken } = require('../middleware/authMiddleware');
// const {authenticateJWT} = require('../middleware/authMiddleware');

//routes
router.get('/specializations',userController.getUsersBySpecializations);
router.get('/status/:status', userController.getUsersByStatus);
router.get('/customers', userController.getAllCustomers);   
router.get('/lawyers/accepted', userController.getLawyersByStatusAccept);
router.get('/lawyers/pending', userController.getLawyersByStatusPending);
router.patch('/:id/status',  userController.updateUserStatus);

//Existing 
router.get('/:id',  userController.getUserById);
router.put('/:id',  userController.updateUser);
router.delete('/:id',  userController.deleteUser);
router.get('/profile',  userController.getProfile);

module.exports = router;
