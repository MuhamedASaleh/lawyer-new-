// controllers/userController.js
const User = require('../models/userModel');
const userValidator = require('../Validations/userValidator');
const { Op } = require('sequelize');

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = userValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedUser = await User.update(req.body, {
      where: { userID: id },
      returning: true,
    });

    res.json(updatedUser[1][0]); // Return the updated user
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.destroy({ where: { userID: id } });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    console.log('req.userID:', req.userID);
    const user = await User.findByPk(req.userID); // req.userID is set by the middleware

    if (!user) {
      console.log('User not found for userID:', req.userID);
      return res.status(404).json({ error: 'User not found' });
    }

    // Check user role and respond accordingly
    if (user.role === 'customer') {
      // Display customer-specific data
      res.json({
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        personalImage: user.personal_image,
        // Add other customer-specific fields if needed
      });
    } else if (user.role === 'lawyer') {
      // Display lawyer-specific data
      res.json({
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        personalImage: user.personal_image,
        lawyerPrice: user.lawyer_price,
        specializations: user.specializations,
        certification: user.certification,
        // Add other lawyer-specific fields if needed
      });
    } else {
      console.log('Invalid role for userID:', req.userID);
      res.status(400).json({ error: 'Invalid role' });
    }
  } catch (error) {
    console.log('Server error', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, personal_image } = req.body;
    const user = await User.findByPk(req.userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.first_name = first_name;
    user.last_name = last_name;
    user.phone_number = phone_number;
    user.personal_image = personal_image;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
   }
};

//GetAllUsersByStatus -lawyers (if condation )
exports.getUsersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!['pending', 'accept', 'reject'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const users = await User.findAll({
      where: { status }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};



// Function to get users by multiple specializations with pagination
exports.getUsersBySpecializations = async (req, res) => {
  try {
    const { specializations, page = 1, limit = 10 } = req.query;

    if (!specializations) {
      return res.status(400).json({ error: 'Specializations query parameter is required' });
    }

    // Split the specializations by comma and trim any extra spaces
    const specializationArray = specializations.split(',').map(s => s.trim());

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate page and limit
    if (isNaN(pageNumber) || pageNumber <= 0) {
      return res.status(400).json({ error: 'Invalid page parameter' });
    }

    if (isNaN(limitNumber) || limitNumber <= 0) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }

    // Calculate offset
    const offset = (pageNumber - 1) * limitNumber;

    // Find users where specializations match any of the provided specializations
    const { count, rows } = await User.findAndCountAll({
      where: {
        specializations: {
          [Op.or]: specializationArray.map(s => ({ [Op.eq]: s }))
        }
      },
      limit: limitNumber,
      offset
    });

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No users found with the specified specializations' });
    }

    res.json({
      total: count,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
      limit: limitNumber,
      users: rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
// Function to get paginated users with the role of 'customer'
exports.getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate page and limit
    if (isNaN(pageNumber) || pageNumber <= 0) {
      return res.status(400).json({ error: 'Invalid page parameter' });
    }

    if (isNaN(limitNumber) || limitNumber <= 0) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }

    // Calculate offset
    const offset = (pageNumber - 1) * limitNumber;

    // Find all customers with pagination
    const { count, rows } = await User.findAndCountAll({
      where: { role: 'customer' },
      limit: limitNumber,
      offset
    });

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No customers found' });
    }

    res.json({
      total: count,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
      limit: limitNumber,
      customers: rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Function to get all lawyers with status 'accept'

exports.getLawyersByStatusAccept = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate page and limit
    if (isNaN(pageNumber) || pageNumber <= 0) {
      return res.status(400).json({ error: 'Invalid page parameter' });
    }

    if (isNaN(limitNumber) || limitNumber <= 0) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }

    // Calculate offset
    const offset = (pageNumber - 1) * limitNumber;

    // Find all lawyers with status 'accept'
    const { count, rows } = await User.findAndCountAll({
      where: {
        role: 'lawyer',
        status: 'accept'
      },
      limit: limitNumber,
      offset
    });

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No lawyers with status "accept" found' });
    }

    res.json({
      total: count,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
      limit: limitNumber,
      lawyers: rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
// Function to get all lawyers with status 'pending'
exports.getLawyersByStatusPending = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate page and limit
    if (isNaN(pageNumber) || pageNumber <= 0) {
      return res.status(400).json({ error: 'Invalid page parameter' });
    }

    if (isNaN(limitNumber) || limitNumber <= 0) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }

    // Calculate offset
    const offset = (pageNumber - 1) * limitNumber;

    // Find all lawyers with status 'pending'
    const { count, rows } = await User.findAndCountAll({
      where: {
        role: 'lawyer',
        status: 'pending'
      },
      limit: limitNumber,
      offset
    });

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No lawyers with status "pending" found' });
    }

    res.json({
      total: count,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
      limit: limitNumber,
      lawyers: rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

//function for update status for lawyer
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the status
    if (!['pending', 'accept', 'reject'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Find and update the user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is a lawyer
    if (user.role !== 'lawyer') {
      return res.status(400).json({ error: 'Status update is only allowed for lawyers' });
    }

    // Update the status
    user.status = status;
    await user.save();

    res.json({ message: 'User status updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
