// controllers/userController.js
// const { Sequelize, Op, fn, col, literal } = require('sequelize');
const User = require('../models/userModel');
const userValidator = require('../Validations/userValidator');
const { Sequelize , Op, fn, col, literal } = require('sequelize');
const asyncHandler = require(`express-async-handler`);
const { Review, Case } = require('../Associations/associations');
const sequelize = require('../config/dbConfig');

// exports.getLawyersBySort = asyncHandler(async (req, res) => {
//   const { specializations } = req.query; // Assume this is a comma-separated string like 'Criminal Law,Corporate Law'
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const sort = req.query.sort || "DESC";
//   const offset = (page - 1) * limit;

 
//   const where = {};
//   if (specializations) {
//     // Convert comma-separated string to an array
//     const specializationArray = specializations.split(',');
//     where.specializations = {
//       [Op.and]: specializationArray.map(spec => Sequelize.literal(`JSON_CONTAINS(specializations, '["${spec}"]')`))
//     };
//   }

//   const { count, rows } = await User.findAndCountAll({
//     where,
//     include: [
//             {
//               model: Review, 
//               as: 'LawyerReviews',
//               attributes: ['rating'] // Include only the rating in the subquery
//             }
//           ],
//     limit,
//     offset,
//     order: [['createdAt', sort]]
//   });

//   res.json({
//     totalRecords: count,
//     totalPages: Math.ceil(count / limit),
//     currentPage: page,
//     users: rows
//   });

//   // const where = {
//   //   role: 'lawyer',
//   //   status: 'accept' // Filter only accepted lawyers
//   // };

//   // if (specialization) {
//   //   where.specializations = {
//   //     [Op.contains]: [specialization]
//   //   };
//   // }

//   // const order = sort === 'top'
//   //   ? [[{ model: Review, as: 'LawyerReviews' }, 'rating', 'DESC']] // Top-rated lawyers
//   //   : sort === 'low'
//   //   ? [[{ model: Review, as: 'LawyerReviews' }, 'rating', 'ASC']] // Low-rated lawyers
//   //   : []; // Default order (if needed, otherwise empty)

//   // try {
//   //   const { count, rows } = await User.findAndCountAll({
//   //     where,
//   //     include: [
//   //       {
//   //         model: Review,
//   //         as: 'LawyerReviews',
//   //         attributes: ['rating'] // Include only the rating in the subquery
//   //       }
//   //     ],
//   //     limit,
//   //     offset,
//   //     order
//   //   });

//   //   const totalPages = Math.ceil(count / limit);

//   //   res.status(200).json({
//   //     total: count,
//   //     totalPages,
//   //     currentPage: page,
//   //     results: rows.map(user => {
//   //       // Calculate average rating
//   //       const averageRating = user.LawyerReviews.reduce((sum, review) => sum + review.rating, 0) / user.LawyerReviews.length || 0;

//   //       return {
//   //         id: user.userID,
//   //         firstName: user.first_name,
//   //         lastName: user.last_name,
//   //         phoneNumber: user.phone_number,
//   //         personalImage: user.personal_image,
//   //         averageRating,
//   //         // Include all other user attributes
//   //         role: user.role,
//   //         nationalNumber: user.national_number,
//   //         lawyerPrice: user.lawyer_price,
//   //         specializations: user.specializations,
//   //         certification: user.certification,
//   //         description: user.description,
//   //         status: user.status,
//   //         createdAt: user.createdAt,
//   //         updatedAt: user.updatedAt
//   //       };
//   //     })
//   //   });
//   // } catch (error) {
//   //   res.status(500).json({
//   //     status: 'error',
//   //     error: {
//   //       statusCode: 500,
//   //       status: 'error'
//   //     },
//   //     message: error.message,
//   //     stack: error.stack
//   //   });
//   // }
// });
// exports.getLawyersByStatusAccept = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;

//     // Convert page and limit to integers
//     const pageNumber = parseInt(page, 10);
//     const limitNumber = parseInt(limit, 10);

//     // Validate page and limit
//     if (isNaN(pageNumber) || pageNumber <= 0) {
//       return res.status(400).json({ error: 'Invalid page parameter' });
//     }

//     if (isNaN(limitNumber) || limitNumber <= 0) {
//       return res.status(400).json({ error: 'Invalid limit parameter' });
//     }

//     // Calculate offset
//     const offset = (pageNumber - 1) * limitNumber;

//     // console.log('Offset:', offset); // Debugging log

//     // Find all lawyers with status 'accept'
//     const { count, rows } = await User.findAndCountAll({
//       where: {
//         role: 'lawyer',
//         status: 'accept'
//       },
//       include: [{
//         model: Review,
//         as: 'LawyerReviews', // Use the correct alias
//         attributes: ['rating']
//       }],
//       limit: limitNumber,
//       offset
//     });

//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'No lawyers with status "accept" found' });
//     }

//     // console.log('Lawyers found:', rows.length); // Debugging log

//     // Calculate the average rating for each lawyer
//     const lawyers = rows.map(lawyer => {
//       const totalRatings = lawyer.LawyerReviews.reduce((sum, review) => sum + review.rating, 0); // Use the correct alias
//       const countReviews = lawyer.LawyerReviews.length; // Use the correct alias
//       const averageRating = countReviews ? Math.ceil(totalRatings / countReviews) : 0;

//       return {
//         ...lawyer.toJSON(),
//         averageRating,
//       };
//     });

//     res.json({
//       total: count,
//       totalPages: Math.ceil(count / limitNumber),
//       currentPage: pageNumber,
//       limit: limitNumber,
//       lawyers
//     });
//   } catch (error) {
//     console.error('Server error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
exports.getLawyersByStatusAccept = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = 'DESC', specializations, status = 'accept' } = req.query;

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

  // Define the where condition
  const where = {
      role: 'lawyer',
      status // Filter by status
  };

  if (specializations) {
      // Convert comma-separated string to an array
      const specializationArray = specializations.split(',');
      where.specializations = {
          [Op.and]: specializationArray.map(spec => Sequelize.literal(`JSON_CONTAINS(specializations, '["${spec}"]')`))
      };
  }

  // Define the order condition based on the sort parameter
  const order = sort === 'top'
      ? [[{ model: Review, as: 'LawyerReviews' }, 'rating', 'DESC']] // Top-rated lawyers
      : sort === 'low'
      ? [[{ model: Review, as: 'LawyerReviews' }, 'rating', 'ASC']] // Low-rated lawyers
      : [['createdAt', sort]]; // Default order by creation date

  try {
      const { count, rows } = await User.findAndCountAll({
          where,
          include: [
              {
                  model: Review,
                  as: 'LawyerReviews',
                  attributes: ['rating'] // Include only the rating in the subquery
              }
          ],
          limit: limitNumber,
          offset,
          order
      });

      if (rows.length === 0) {
          return res.status(404).json({ error: 'No lawyers found' });
      }

      // Calculate the average rating for each lawyer
      const lawyers = rows.map(user => {
          const averageRating = user.LawyerReviews.reduce((sum, review) => sum + review.rating, 0) / user.LawyerReviews.length || 0;

          return {
              id: user.userID,
              firstName: user.first_name,
              lastName: user.last_name,
              phoneNumber: user.phone_number,
              personalImage: user.personal_image,
              averageRating,
              role: user.role,
              nationalNumber: user.national_number,
              lawyerPrice: user.lawyer_price,
              specializations: user.specializations,
              certification: user.certification,
              description: user.description,
              status: user.status,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
          };
      });

      res.status(200).json({
          total: count,
          totalPages: Math.ceil(count / limitNumber),
          currentPage: pageNumber,
          limit: limitNumber,
          results: lawyers
      });
  } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({
          status: 'error',
          error: {
              statusCode: 500,
              status: 'error'
          },
          message: error.message,
          stack: error.stack
      });
  }
});

exports.getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.role === 'customer') {
    return res.json({
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      personalImage: user.personal_image
    });
  } else if (user.role === 'lawyer') {
    // Fetch all reviews for the lawyer
    const reviews = await Review.findAll({
      where: { lawyerID: user.userID },
      attributes: ['rating']
    });

    // Calculate the total number of reviews
    const totalReviews = reviews.length;

    // Initialize counts for each star rating
    const starCounts = Array(6).fill(0);

    // Sum ratings and count each star rating
    let sumRatings = 0;
    reviews.forEach(review => {
      const rating = review.rating;
      starCounts[rating]++;
      sumRatings += rating;
    });

    // Calculate average rating
    const averageRating = totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : 0;

    // Calculate percentages and include counts for each star rating
    const ratingCounts = starCounts.map((count, index) => ({
      stars: index,
      count: count,
      percentage: totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(2) : 0
    }));

    // Fetch count of won cases for the lawyer
    const wonCasesCount = await Case.count({
      where: { lawyerId: user.userID, status: 'won' }
    });

    return res.json({
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      personalImage: user.personal_image,
      lawyerPrice: user.lawyer_price,
      specializations: user.specializations,
      certification: user.certification,
      description: user.description,
      ratingCounts: ratingCounts,
      averageRating: parseFloat(averageRating),
      wonCasesCount: wonCasesCount
    });
  } else {
    return res.status(400).json({ error: 'Invalid role' });
  }
});

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
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.role === 'customer') {
    // Display customer-specific data
    return res.json({
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      personalImage: user.personal_image
    });
  } else if (user.role === 'lawyer') {
    // Fetch all reviews for the lawyer
    const reviews = await Review.findAll({
      where: { lawyerID: user.userID },
      attributes: ['rating']
    });

    // Calculate the total number of reviews
    const totalReviews = reviews.length;

    // Initialize counts for each star rating
    const starCounts = Array(6).fill(0);

    // Sum ratings and count each star rating
    let sumRatings = 0;
    reviews.forEach(review => {
      const rating = review.rating;
      starCounts[rating]++;
      sumRatings += rating;
    });

    // Calculate average rating
    const averageRating = totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : 0;

    // Calculate percentages and include counts for each star rating
    const ratingCounts = starCounts.map((count, index) => ({
      stars: index,
      count: count,
      percentage: totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(2) : 0
    }));

    // Fetch count of won cases for the lawyer
    const wonCasesCount = await Case.count({
      where: { lawyerId: user.userID, status: 'won' }
    });

    // Display lawyer-specific data
    return res.json({
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      personalImage: user.personal_image,
      lawyerPrice: user.lawyer_price,
      specializations: user.specializations,
      certification: user.certification,
      description: user.description,
      ratingCounts: ratingCounts,
      averageRating: parseFloat(averageRating),
      wonCasesCount: wonCasesCount
    });
  } else {
    return res.status(400).json({ error: 'Invalid role' });
  }
});

// Update User Profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { first_name, last_name, phone_number, personal_image, description } = req.body;

  // Find the user by their primary key (ID) and exclude sensitive fields from the response
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password', 'confirm_password', 'createdAt', 'updatedAt'] },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found, update profile controller' });
  }

  // Update the user fields with the provided values or keep the existing values
  user.first_name = first_name || user.first_name;
  user.last_name = last_name || user.last_name;
  user.phone_number = phone_number || user.phone_number;
  user.personal_image = personal_image || user.personal_image;
  user.description = description || user.description;


  // Save the updated user profile
  await user.save();

  res.status(201).json({ message: "updated", data: user });
});


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

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

exports.getLawyerCountsByMonth = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ message: 'Year is required' });
    }

    const startOfYear = `${year}-01-01 00:00:00`;
    const endOfYear = `${year}-12-31 23:59:59`;

    const counts = await User.findAll({
      attributes: [
        [fn('MONTH', col('createdAt')), 'month'],
        [fn('COUNT', col('userID')), 'count']
      ],
      where: {
        role: 'lawyer',
        createdAt: {
          [Op.between]: [startOfYear, endOfYear]
        }
      },
      group: [fn('MONTH', col('createdAt'))],
      order: [literal('month')]
    });

    const result = monthNames.map((name, index) => {
      const monthData = counts.find(c => c.dataValues.month === index + 1);
      return {
        month: name,
        count: monthData ? monthData.dataValues.count : 0
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching lawyer counts by month:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

exports.getCustomerCountsByMonth = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ message: 'Year is required' });
    }

    const startOfYear = `${year}-01-01 00:00:00`;
    const endOfYear = `${year}-12-31 23:59:59`;

    const counts = await User.findAll({
      attributes: [
        [fn('MONTH', col('createdAt')), 'month'],
        [fn('COUNT', col('userID')), 'count']
      ],
      where: {
        role: 'customer',
        createdAt: {
          [Op.between]: [startOfYear, endOfYear]
        }
      },
      group: [fn('MONTH', col('createdAt'))],
      order: [literal('month')]
    });

    const result = monthNames.map((name, index) => {
      const monthData = counts.find(c => c.dataValues.month === index + 1);
      return {
        month: name,
        count: monthData ? monthData.dataValues.count : 0
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching customer counts by month:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

