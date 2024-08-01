// controllers/userController.js
const { Sequelize } = require('sequelize');
const User = require('../models/userModel');
const userValidator = require('../Validations/userValidator');
const { Op } = require('sequelize');
const asyncHandler = require(`express-async-handler`);
const {Review} = require('../Associations/associations');

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found user by id' });
    }

    res.status(200).json(user);
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

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id); // req.userID is set by the middleware

  if (!user) {
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
    res.status(400).json({ error: 'Invalid role' });
  }

}
)
// Update User Profile
exports.updateProfile = asyncHandler(async (req, res) => {

  const { first_name, last_name, phone_number, personal_image } = req.body;
  const user = await User.findByPk(req.user.id,{
    attributes: { exclude: ['password',`confirm_password` , `createdAt` , `updatedAt`] },
  });
  if (!user) {
    return res.status(404).json({ error: 'User not found ,  update profile controller' });
  }
  user.first_name = first_name || user.first_name;
  user.last_name = last_name || user.last_name;
  user.phone_number = phone_number || user.phone_number;
  user.personal_image = personal_image || user.personal_image;
  await user.save();
  
  res.status(201).json({ message: "updated", data: user });

})

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

    // Build the where condition based on specializations
    let whereCondition = {};
    if (specializations) {
      // Split the specializations by comma and trim any extra spaces
      const specializationArray = specializations.split(',').map(s => s.trim());
      whereCondition = {
        specializations: {
          [Op.or]: specializationArray.map(s => ({ [Op.eq]: s }))
        }
      };
    }

    // Find users based on the where condition
    const { count, rows } = await User.findAndCountAll({
      where: whereCondition,
      limit: limitNumber,
      offset
    });

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No users found' });
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
      include: [{
        model: Review,
        as: 'Reviews',
        attributes: ['rating']
      }],
      limit: limitNumber,
      offset
    });

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No lawyers with status "accept" found' });
    }

    // Calculate the average rating for each lawyer
    const lawyers = rows.map(lawyer => {
      const totalRatings = lawyer.Reviews.reduce((sum, review) => sum + review.rating, 0);
      const countReviews = lawyer.Reviews.length;
      const averageRating = countReviews ? Math.ceil(totalRatings / countReviews) : 0;

      return {
        ...lawyer.toJSON(),
        averageRating,
      };
    });

    res.json({
      total: count,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
      limit: limitNumber,
      lawyers
    });
  } catch (error) {
    console.error(error);
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
      return res.status(404).json({ error: 'User not found update status' });
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
// get all lawyers by role is lawyer with pagintion
exports.getAllLawyers = async (req, res) => {
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

    // Find all lawyers with pagination and include their reviews
    const { count, rows } = await User.findAndCountAll({
      where: { role: 'lawyer' },
      limit: limitNumber,
      offset,
      include: [{
        model: Review,
        as: 'Reviews',
        attributes: []
      }],
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('Reviews.rating')), 'averageRating']
        ]
      },
      group: ['User.userID'],
      subQuery: false
    });

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No lawyers found' });
    }

    const lawyers = rows.map(lawyer => ({
      userID: lawyer.userID,
      role: lawyer.role,
      first_name: lawyer.first_name,
      last_name: lawyer.last_name,
      phone_number: lawyer.phone_number,
      personal_image: lawyer.personal_image,
      national_number: lawyer.national_number,
      lawyer_price: lawyer.lawyer_price,
      specializations: lawyer.specializations,
      certification: lawyer.certification,
      status: lawyer.status,
      createdAt: lawyer.createdAt,
      updatedAt: lawyer.updatedAt,
      averageRating: Math.ceil(parseFloat(lawyer.dataValues.averageRating)) // Applying Math.ceil to the average rating
    }));

    res.json({
      total: count.length,
      totalPages: Math.ceil(count.length / limitNumber),
      currentPage: pageNumber,
      limit: limitNumber,
      lawyers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// get all lawyers count 

exports.getLawyerCount = asyncHandler(async (req, res) => {
    const lawyerCount = await User.count({ where: { role: 'lawyer' } });

    res.status(200).json({ count: lawyerCount });
});