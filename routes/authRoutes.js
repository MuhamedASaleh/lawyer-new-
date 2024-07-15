// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest'); // Import the validation middleware
const userValidationSchema = require('../Validations/userValidator'); // Correctly import the validation schema
const upload = require('../middleware/uploadMiddleware');

router.post('/register',upload.fields([
    { name: 'personal_image', maxCount: 1 },
    { name: 'certification', maxCount: 1 }
]), validateRequest(userValidationSchema), authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;
 