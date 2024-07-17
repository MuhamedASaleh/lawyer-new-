const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');

// Create a new admin
router.post('/admins', adminController.createAdmin);

// Get all admins
router.get('/admins', adminController.getAllAdmins);

// Get admin by ID
router.get('/admins/:id', adminController.getAdminById);

// Update an admin
router.put('/admins/:id', adminController.updateAdmin);

// Delete an admin
router.delete('/admins/:id', adminController.deleteAdmin);

// Admin registration route
router.post('/admin/register', adminController.registerAdmin);

// Admin login route
router.post('/admin/login', adminController.loginAdmin);

module.exports = router;
 