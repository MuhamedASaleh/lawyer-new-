// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { updateProfile, getProfile } = require('../controllers/userController');

const { Auth, AuthorizeRole } = require('../middleware/auth')
//routes
router.get('/specializations', userController.getUsersBySpecializations);
router.get('/status/:status', userController.getUsersByStatus);
router.get('/customers', userController.getAllCustomers);
router.get('/lawyers/accepted', userController.getLawyersByStatusAccept);
router.get('/lawyers/pending', userController.getLawyersByStatusPending);
router.patch('/:id/status', userController.updateUserStatus);

//Existing 
router.get('/:id', Auth, userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/current/profile', Auth, getProfile);
router.put('/current/profile', Auth, updateProfile);

module.exports = router;
