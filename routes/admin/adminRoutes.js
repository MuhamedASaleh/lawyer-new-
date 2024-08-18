const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');
const { Auth, AuthorizeRole } = require('../../middleware/auth');

// Create a new admin
router.post('/admins', adminController.createAdmin);

// Get all admins
router.get('/admins', adminController.getAllAdmins);

// Get admin by ID
router.get('/admins/:id',Auth , AuthorizeRole('super_admin') , adminController.getAdminById);

// Update an admin
router.put('/admins/:id',Auth , AuthorizeRole('super_admin') , adminController.updateAdmin);

// Delete an admin
router.delete('/admins/:id',Auth , AuthorizeRole('super_admin') , adminController.deleteAdmin);

// Admin registration route
router.post('/admin/register',Auth , AuthorizeRole('super_admin') , adminController.registerAdmin);

// Admin login route
router.post('/admin/login', adminController.loginAdmin);

module.exports = router;
 