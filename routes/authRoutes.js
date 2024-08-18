// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { upload } = require('../middleware/uploadMiddleware');
// const validateRequest = require('../middleware/validateRequest'); // Import the validation middleware
// const userValidationSchema = require('../Validations/userValidator'); // Correctly import the validation schema

const { Auth, AuthorizeRole } = require('../middleware/auth');
router.post('/register', upload.fields([
    { name: 'personal_image', maxCount: 1 },
    { name: 'certification', maxCount: 1 }
  ]) ,authController.registerUser);
router.post('/login', authController.loginUser);
router.put('/status/:userId', Auth, AuthorizeRole('admin'), authController.updateUserStatus);
router.get('/specializations', authController.getAllSpecializations);


module.exports = router;
