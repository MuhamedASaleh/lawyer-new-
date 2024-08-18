// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { updateProfile, getProfile, getUserCases } = require('../controllers/userController');

const { Auth, AuthorizeRole } = require('../middleware/auth')
//routes

// Route to get the count of lawyers
router.get('/lawyers/accepted', userController.getLawyersByStatusAccept);
// router.get('/lawyerBySort', userController.getLawyersBySort);
router.get('/lawyerCount', Auth, userController.getLawyerCount);
router.get('/lawyer-counts', Auth, userController.getLawyerCountsByMonth);
router.get('/customer-counts', Auth, userController.getCustomerCountsByMonth);


//Existing 
router.get('/specializations', userController.getUsersBySpecializations);
router.get('/status/:status', userController.getUsersByStatus);
router.get('/customers', userController.getAllCustomers);

router.get('/lawyers/pending', userController.getLawyersByStatusPending);
router.patch('/:id/status', Auth, AuthorizeRole('admin'), userController.updateUserStatus);
router.get('/lawyers', userController.getAllLawyers);
router.get('/:id', Auth, userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);  // upload on postman 
router.get('/current/profile', Auth, getProfile);
router.put('/current/profile', Auth, updateProfile);
router.get('/cases/user' ,Auth ,  getUserCases);

    
module.exports = router;
