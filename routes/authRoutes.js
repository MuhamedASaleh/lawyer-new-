// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest'); // Import the validation middleware
const userValidationSchema = require('../Validations/userValidator'); // Correctly import the validation schema
const { upload } = require('../utils/files');
const { Auth, AuthorizeRole } = require('../middleware/auth');
router.post('/register', upload ,authController.registerUser);
router.post('/login', authController.loginUser);
router.put('/status/:userId', Auth, AuthorizeRole('admin'), authController.updateUserStatus);
router.get('/specializations', authController.getAllSpecializations);


module.exports = router;
