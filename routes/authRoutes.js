// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest'); // Import the validation middleware
const userValidationSchema = require('../Validations/userValidator'); // Correctly import the validation schema

router.post('/register', validateRequest(userValidationSchema), authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;
 