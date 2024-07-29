const Case = require('../models/caseModel')
// const User = require("../models/userModel")
const { Op } = require('sequelize');

const asyncHandler = require('express-async-handler');

exports.createCase = async (req, res) => {
  try {
    console.log(req.user.id)
    const { judge_name, lawyer_fees, court_fees } = req.body;

    const newCase = await Case.create({
      judge_name,
      lawyer_fees,
      court_fees,
      status: 'pending',
      lawyerId: req.user.id,
      customerId: 4, // here we should do somthing to modify that the custmor send file to get his id 
    });

    const caseWithDetails = await Case.findByPk(newCase.caseID);
    res.status(201).json(caseWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCaseDetails = async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseDetails = await Case.findByPk(caseId);
    if (!caseDetails) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.status(200).json(caseDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCaseStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status } = req.body;

    const caseToUpdate = await Case.findByPk(caseId);
    if (!caseToUpdate) {
      return res.status(404).json({ message: 'Case not found' });
    }


    if (caseToUpdate.status !== 'pending') {
      return res.status(400).json({ message: 'Case is not pending' });
    }

    caseToUpdate.status = status;
    await caseToUpdate.save();

    res.status(200).json(caseToUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCustomerFiles = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { files } = req.body;

    const caseToUpdate = await Case.findByPk(caseId);
    if (!caseToUpdate) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Add the new files to the existing customer_files
    caseToUpdate.customer_files = files;

    await caseToUpdate.save();

    res.status(200).json(caseToUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.filterCurrentCase = asyncHandler(async (req, res) =>{ 

  const { status, page = 1, limit = 10 } = req.query;
  console.log(req.user.id);


  
  let whereCondition = {};
  
  if (status) {
    // If status is provided, filter by that status
    whereCondition.status = status;
    console.log(whereCondition);
  } else {
    // If status is not provided or is empty, return all cases with specific statuses
    whereCondition.status = {
      [Op.in]: ['inspection', 'court', 'pleadings', 'completed']
    };
    console.log(whereCondition);
    console.log(req.user);
  }

  // Convert page and limit to integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Calculate offset
  const offset = (pageNumber - 1) * limitNumber;

  // Find cases with pagination
  const { count, rows } = await Case.findAndCountAll({
    where: {
      ...whereCondition,
      [Op.or]: [
        { lawyerId: req.user.id },
        { customerId: req.user.id }
      ]
    },
    limit: limitNumber,
    offset
  });

  if (!rows || rows.length === 0) {
    return res.status(404).json({ state: 'failed', message: 'nothing to show, Case for current user is empty' });
  }

  res.status(200).json({
    total: count,
    totalPages: Math.ceil(count / limitNumber),
    currentPage: pageNumber,
    limit: limitNumber,
    data: rows
  });
});

// Filtering and pagination for current cases (inspection, court, pleadings, completed) for admin
exports.filterCurrentCaseAdmin = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  let whereCondition = {};

  if (status) {
    // If status is provided, filter by that status
    whereCondition.status = status;
    console.log(whereCondition);
  } else {
    // If status is not provided or is empty, return all cases with specific statuses
    whereCondition.status = {
      [Op.in]: ['inspection', 'court', 'pleadings', 'completed']
    };
    console.log(whereCondition);
  }

  // Convert page and limit to integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Calculate offset
  const offset = (pageNumber - 1) * limitNumber;

  // Find cases with pagination
  const { count, rows } = await Case.findAndCountAll({
    where: whereCondition,
    limit: limitNumber,
    offset
  });

  if (!rows || rows.length === 0) {
    return res.status(404).json({ state: 'failed', message: 'nothing to show, Case is empty' });
  }

  res.status(200).json({
    total: count,
    totalPages: Math.ceil(count / limitNumber),
    currentPage: pageNumber,
    limit: limitNumber,
    data: rows
  });
});



exports.updateCaseStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status } = req.body;

    const caseToUpdate = await Case.findByPk(caseId);
    if (!caseToUpdate) {
      return res.status(404).json({ message: 'Case not found' });
    }

    if (status === 'declined') {
      // Update the status to 'declined'
      caseToUpdate.status = 'declined';
      await caseToUpdate.save();

      // Delete the case from the database
      await caseToUpdate.destroy();

      return res.status(200).json({ message: 'Case declined and deleted successfully' });
    }

    // Ensure case is in 'pending' status before updating to 'accepted'
    if (caseToUpdate.status !== 'pending') {
      return res.status(400).json({ message: 'Case is not pending' });
    }

    // Update case status to 'accepted'
    caseToUpdate.status = status;
    await caseToUpdate.save();

    res.status(200).json(caseToUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCustomerFiles = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { files } = req.body;

    const caseToUpdate = await Case.findByPk(caseId);
    if (!caseToUpdate) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Add the new files to the existing customer_files
    caseToUpdate.customer_files = files;

    await caseToUpdate.save();

    res.status(200).json(caseToUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//filtering completed cases with won or lost or both of them 
exports.filterCompletedCases = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  let whereCondition = {};

  if (status && ['won', 'lost'].includes(status)) {
    // If status is provided and valid, filter by that status
    whereCondition.status = status;
  } else {
    // If status is not provided or invalid, return both "won" and "lost" cases
    whereCondition.status = {
      [Op.in]: ['won', 'lost']
    };
  }

  // Convert page and limit to integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Calculate offset
  const offset = (pageNumber - 1) * limitNumber;

  // Find cases with pagination
  const { count, rows } = await Case.findAndCountAll({
    where: {
      ...whereCondition,
      [Op.or]: [
        { lawyerId: req.user.id },
        { customerId: req.user.id }
      ]
    },
    limit: limitNumber,
    offset
  });

  if (!rows || rows.length === 0) {
    return res.status(404).json({ state: 'failed', message: 'No completed cases found' });
  }

  res.status(200).json({
    total: count,
    totalPages: Math.ceil(count / limitNumber),
    currentPage: pageNumber,
    limit: limitNumber,
    data: rows
  });
});

exports.filterCompletedCasesAdmin = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  let whereCondition = {};

  if (status && ['won', 'lost'].includes(status)) {
    // If status is provided and valid, filter by that status
    whereCondition.status = status;
  } else {
    // If status is not provided or invalid, return both "won" and "lost" cases
    whereCondition.status = {
      [Op.in]: ['won', 'lost']
    };
  }

  // Convert page and limit to integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Calculate offset
  const offset = (pageNumber - 1) * limitNumber;

  // Find cases with pagination
  const { count, rows } = await Case.findAndCountAll({
    where: whereCondition,
    limit: limitNumber,
    offset
  });

  if (!rows || rows.length === 0) {
    return res.status(404).json({ state: 'failed', message: 'No completed cases found' });
  }

  res.status(200).json({
    total: count,
    totalPages: Math.ceil(count / limitNumber),
    currentPage: pageNumber,
    limit: limitNumber,
    data: rows
  });
});


//filtering for pending case in lawyer and customer with (token)

exports.filterPendingCases = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const whereCondition = {
    status: 'pending'
  };

  // Convert page and limit to integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Calculate offset
  const offset = (pageNumber - 1) * limitNumber;

  // Find cases with pagination
  const { count, rows } = await Case.findAndCountAll({
    where: {
      ...whereCondition,
      [Op.or]: [
        { lawyerId: req.user.id },
        { customerId: req.user.id }
      ]
    },
    limit: limitNumber,
    offset
  });

  if (!rows || rows.length === 0) {
    return res.status(404).json({ state: 'failed', message: 'No pending cases found' });
  }

  res.status(200).json({
    total: count,
    totalPages: Math.ceil(count / limitNumber),
    currentPage: pageNumber,
    limit: limitNumber,
    data: rows
  });
});
//filtering for pending case in admin with (token)
exports.filterPendingCasesAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const whereCondition = {
    status: 'pending'
  };

  // Convert page and limit to integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Calculate offset
  const offset = (pageNumber - 1) * limitNumber;

  // Find cases with pagination
  const { count, rows } = await Case.findAndCountAll({
    where: whereCondition,
    limit: limitNumber,
    offset
  });

  if (!rows || rows.length === 0) {
    return res.status(404).json({ state: 'failed', message: 'No pending cases found' });
  }

  res.status(200).json({
    total: count,
    totalPages: Math.ceil(count / limitNumber),
    currentPage: pageNumber,
    limit: limitNumber,
    data: rows
  });
});

//get length or count of cases by filter status 
exports.countCases = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let whereCondition = {};

  if (status) {
    // If status is provided, filter by that status
    whereCondition.status = status;
  } else {
    // If status is not provided, count all cases
    whereCondition.status = {
      [Op.in]: [
        'inspection', 'court', 'pleadings', 'completed',
        'won', 'lost', 'pending', 'accepted', 'decline'
      ]
    };
  }

  // Find case count
  const caseCount = await Case.count({
    where: {
      ...whereCondition,
      [Op.or]: [
        { lawyerId: req.user.id },
        { customerId: req.user.id }
      ]
    }
  });

  res.status(200).json({
    totalCount: caseCount
  });
});

