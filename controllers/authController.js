// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/jwtConfig');
// const userValidator = require('../Validations/userValidator');

const specializationsList = [
  'Criminal Law',
  'Civil Law',
  'Commercial Law',
  'Family Law',
  'International Law',
  'Labor Law',
  'Intellectual Property Law',
  'Corporate Law',
  'Administrative Law',
  'Constitutional Law',
  'Tax Law',
  'Environmental Law'
];

// Get all specializations
exports.getAllSpecializations = async (req, res) => {
  try {
    res.json({ specializations: specializationsList });
  } catch (error) {
    console.error('Error fetching specializations:', error);
    res.status(500).json({ error: error.message });
  }
}; 



exports.registerUser = async (req, res) => {
  try {
    const {
      role,
      first_name,
      last_name,
      phone_number,
      password,
      confirm_password,
      national_number,
      certification
    } = req.body;

    let specializations = [];

    // Handle specializations only if the role is not "customer"
    if (role !== 'customer' && req.body.specializations) {
      try {
        specializations = JSON.parse(req.body.specializations);
      } catch (parseError) {
        return res.status(400).json({ error: 'Invalid JSON format for specializations' });
      }

      // Validate specializations
      const isValidSpecializations = specializations.every(spec => specializationsList.includes(spec));
      if (!isValidSpecializations) {
        return res.status(400).json({ error: 'Invalid specializations' });
      }
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userStatus = role === 'lawyer' ? 'pending' : null;

    const newUser = await User.create({
      role,
      first_name,
      last_name,
      phone_number,
      password: hashedPassword,
      confirm_password: hashedPassword,
      national_number,
      specializations,
      certification,
      status: userStatus,
      personal_image: req.file ? req.file.buffer : null
    });

    const token = jwt.sign({ id: newUser.userID, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

    res.status(201).json({ msg: "User has been created", data: newUser, token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const { phone_number, password } = req.body;
    const user = await User.findOne({ where: { phone_number } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.role === 'lawyer' && ['pending', 'reject'].includes(user.status)) {
      return res.status(403).json({ error: "Account is not active. Please contact admin." });
    }

    const token = jwt.sign({ id: user.userID, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

    res.json({ token, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    // Ensure status is either 'accept' or 'reject'
    if (!['accept', 'reject'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only update the status of lawyers
    if (user.role !== 'lawyer') {
      return res.status(400).json({ error: "Only lawyers' status can be updated" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ msg: "User status updated successfully", data: user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: error.message });
  }
};