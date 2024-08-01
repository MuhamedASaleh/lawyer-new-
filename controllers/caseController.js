const Case = require('../models/caseModel')
// const User = require("../models/userModel")
const { Op, fn, col, literal } = require('sequelize');

const asyncHandler = require('express-async-handler');
const sequelize = require('../config/dbConfig');

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
      customerId:req.user.id, // here we should do somthing to modify that the custmor send file to get his id 
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


exports.filterCurrentCase = asyncHandler(async (req, res) => { 
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
      [Op.in]: ['accepted', 'inspection', 'court', 'pleadings', 'completed']
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

  res.status(200).json({
    total: count,
    totalPages: Math.ceil(count / limitNumber),
    currentPage: pageNumber,
    limit: limitNumber,
    data: rows.length > 0 ? rows : []
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
  // Define all possible statuses
  const statuses = [
    'inspection', 'court', 'pleadings', 'completed',
    'won', 'lost', 'pending', 'accepted', 'decline'
  ];

  let whereCondition = {
    [Op.or]: [
      { lawyerId: req.user.id },
      { customerId: req.user.id }
    ]
  };

  // Find case count for each status type
  const counts = await Promise.all(
    statuses.map(async (status) => {
      const count = await Case.count({
        where: {
          ...whereCondition,
          status: status
        }
      });
      return { status, count };
    })
  );

  // Calculate the total count
  const totalCount = counts.reduce((acc, curr) => acc + curr.count, 0);

  const response = {
    totalCount,
    statusCounts: counts.reduce((acc, curr) => {
      acc[curr.status] = curr.count;
      return acc;
    }, {})
  };

  res.status(200).json(response);
});

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const statuses = ['inspection', 'court', 'pleadings', 'completed', 'won', 'lost', 'pending', 'accepted', 'decline'];

const getMonthNumber = (monthName) => monthNames.indexOf(monthName) + 1;
const getDayNumber = (dayName) => dayNames.indexOf(dayName);

exports.getCaseStatistics = asyncHandler(async (req, res) => {
  const { year, month, day } = req.query;

  // Validate and parse the dates
  let start, end;

  const currentYear = new Date().getFullYear();
  const monthNumber = month ? getMonthNumber(month) : 0;
  const dayNumber = day ? getDayNumber(day) : -1;

  if (year && month && day) {
    if (monthNumber === 0 || dayNumber === -1) {
      return res.status(400).json({ error: 'Invalid month or day name' });
    }
    start = new Date(year, monthNumber - 1, dayNumber + 1);
    end = new Date(year, monthNumber - 1, dayNumber + 1, 23, 59, 59);
  } else if (year && month) {
    if (monthNumber === 0) {
      return res.status(400).json({ error: 'Invalid month name' });
    }
    start = new Date(year, monthNumber - 1, 1);
    end = new Date(year, monthNumber, 0, 23, 59, 59);
  } else if (year) {
    start = new Date(year, 0, 1);
    end = new Date(year, 11, 31, 23, 59, 59);
  } else if (month) {
    if (monthNumber === 0) {
      return res.status(400).json({ error: 'Invalid month name' });
    }
    start = new Date(currentYear, monthNumber - 1, 1);
    end = new Date(currentYear, monthNumber, 0, 23, 59, 59);
  } else {
    start = new Date(0); // Earliest possible date
    end = new Date(); // Current date
  }

  // Aggregate the cases
  const cases = await Case.findAll({
    attributes: [
      [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
      [sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
      [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
      [sequelize.fn('DAY', sequelize.col('createdAt')), 'day'],
      'status',
      [sequelize.fn('COUNT', sequelize.col('caseID')), 'count']
    ],
    where: {
      createdAt: {
        [Op.between]: [start, end]
      },
      [Op.or]: [
        { lawyerId: req.user.id },
        { customerId: req.user.id }
      ]
    },
    group: ['date', 'status', 'year', 'month', 'day']
  });

  const statistics = {
    daily: {},
    monthly: {},
    yearly: {}
  };

  cases.forEach(caseData => {
    const date = caseData.get('date');
    const year = caseData.get('year');
    const month = monthNames[caseData.get('month') - 1];
    const day = caseData.get('day');
    const status = caseData.get('status');
    const count = caseData.get('count');

    // Format daily statistics
    if (!statistics.daily[date]) {
      statistics.daily[date] = {};
    }
    statistics.daily[date][status] = count;

    // Format monthly statistics
    const monthKey = `${month}-${year}`;
    if (!statistics.monthly[monthKey]) {
      statistics.monthly[monthKey] = {};
    }
    statistics.monthly[monthKey][status] = count;

    // Format yearly statistics
    if (!statistics.yearly[year]) {
      statistics.yearly[year] = {};
    }
    statistics.yearly[year][status] = count;
  });

  // Ensure all statuses are included in the response
  const ensureStatuses = (stats) => {
    Object.keys(stats).forEach(key => {
      statuses.forEach(status => {
        if (!stats[key][status]) {
          stats[key][status] = 0;
        }
      });
    });
  };

  ensureStatuses(statistics.daily);
  ensureStatuses(statistics.monthly);
  ensureStatuses(statistics.yearly);

  // Format the response as arrays of objects with 'time' key, excluding zero counts
  const formatStatistics = (stats) => {
    return Object.keys(stats).map(key => {
      const result = { time: key };
      Object.keys(stats[key]).forEach(status => {
        if (stats[key][status] > 0) {
          result[status] = stats[key][status];
        }
      });
      return result;
    });
  };

  const formattedDaily = formatStatistics(statistics.daily);
  const formattedMonthly = formatStatistics(statistics.monthly);
  const formattedYearly = formatStatistics(statistics.yearly);
console.log(formattedMonthly);
  res.status(200).json({
    daily: formattedDaily,
    monthly: formattedMonthly,
    yearly: formattedYearly
  });
});




exports.getLawyerCaseCountsByMonth = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({ error: 'Year parameter is required' });
  }

  // Set the start and end dates based on the year parameter
  const startDate = `${year}-01-01 00:00:00`;
  const endDate = `${year}-12-31 23:59:59`;

  try {
    // Fetch cases grouped by month
    const cases = await Case.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), '%m'), 'month'],
        [fn('COUNT', col('caseID')), 'totalCount'],
        [fn('SUM', literal('CASE WHEN status = "won" THEN 1 ELSE 0 END')), 'wonCount']
      ],
      where: {
        lawyerId: id,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: [fn('DATE_FORMAT', col('createdAt'), '%m')],
      order: [fn('DATE_FORMAT', col('createdAt'), '%m')]
    });

    // Create a map for the results
    const resultMap = {};
    cases.forEach(c => {
      const monthNumber = parseInt(c.get('month'), 10);
      resultMap[monthNumber] = {
        totalCount: parseInt(c.get('totalCount')),
        wonCount: parseInt(c.get('wonCount'))
      };
    });

    // Generate the final result with all 12 months
    const result = monthNames.map((monthName, index) => {
      const monthNumber = index + 1;
      return {
        month: monthName,
        totalCount: resultMap[monthNumber]?.totalCount || 0,
        wonCount: resultMap[monthNumber]?.wonCount || 0
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});