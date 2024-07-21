// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/jwtConfig');
// const userValidator = require('../Validations/userValidator');

exports.registerUser = async (req, res) => {
  try {
    // Validate user input


    // Destructure user data from request body
    const {
      role,
      first_name,
      last_name,
      phone_number,
      password,
      confirm_password,
      national_number,
      specializations,
      certification,
      status
    } = req.body;

    // Check if the password and confirm_password match
    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords don't match" });
    }



    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
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
      status
    });

    // Generate JWT token
    const token = jwt.sign({ userID: newUser.userID }, JWT_SECRET, { expiresIn: +process.env.JWT_EXPIRATION * 60 * 60 * 24 });

    // Respond with the token and user data
    res.status(201).json({ msg: "User has been created", data: newUser, token: token });
  } catch (error) {
    // Handle errors
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { phone_number, password } = req.body;
    console.log('Login request received for phone_number:', phone_number);

    // Find user by phone_number
    const user = await User.findOne({ where: { phone_number } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userID: user.userID }, JWT_SECRET, { expiresIn: +process.env.JWT_EXPIRATION * 60 * 60 * 24 });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
