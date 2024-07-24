const Case = require('../models/caseModel')
// const User = require("../models/userModel")
const { Op } = require('sequelize');

const asyncHandler = require('express-async-handler');

exports.createCase = async (req, res) => {
  try {
    const { judge_name, lawyer_fees, court_fees } = req.body;

    const newCase = await Case.create({
      judge_name,
      lawyer_fees,
      court_fees,
      status: 'pending'
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

  console.log(req.user.id);
  const { status } = req.body;

  let whereCondition = {};

  if (status) {
    // If status is provided, filter by that status
    whereCondition.status = status;
    console.log(whereCondition)
  } else {
    // If status is not provided or is empty, return all cases with specific statuses
    whereCondition.status = {
      [Op.in]: ['inspection', 'court', 'pleadings', 'completed']
    };
    console.log(whereCondition)
  }

  const cases = await Case.findAll({ where: whereCondition });

  if (!cases || cases.length === 0) {
    return res.status(404).json({ state: 'failed', message: 'nothing to show, Case for current user is empty' });
  }

  res.status(200).json({ data: cases });
});

exports.filterCurrentCaseAdmin = asyncHandler(async (req, res) => {

  const { status } = req.body;

  let whereCondition = {};

  if (status) {
    // If status is provided, filter by that status
    whereCondition.status = status;
    console.log(whereCondition)
  } else {
    // If status is not provided or is empty, return all cases with specific statuses
    whereCondition.status = {
      [Op.in]: ['inspection', 'court', 'pleadings', 'completed']
    };
    console.log(whereCondition)
  }

  const cases = await Case.findAll({ where: whereCondition });

  if (!cases || cases.length === 0) {
    return res.status(404).json({ state: 'failed', message: 'nothing to show, Case is empty' });
  }

  res.status(200).json({ data: cases });
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
