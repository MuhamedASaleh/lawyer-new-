const router = require('express').Router();
const { 
  filterCurrentCase, 
  filterCurrentCaseAdmin,
  filterCompletedCases, 
  filterCompletedCasesAdmin,
  createCase, 
  getCaseDetails, 
  updateCaseStatus, 
  updateCustomerFiles, 
  filterPendingCases,
  filterPendingCasesAdmin,
  countCases,
  getCaseStatistics,
  getLawyerCaseCountsByMonth,
  getCaseStatusHistory,
} = require('../controllers/caseController');
const { Auth, AuthorizeRole } = require('../middleware/auth');

// Route to create a new case
router.post('/create', Auth, AuthorizeRole('lawyer'), createCase);

// Route to get case details
router.get('/:caseId/details', getCaseDetails);

// Route to update case status to accepted (for customers only)
router.put('/:caseId/updateStatus', updateCaseStatus);

// Route to update customer files (for customers only)
router.put('/:caseId/updateCustomerFiles', updateCustomerFiles);

// Route to filter current cases
router.get('/filterCurrentCase', Auth, AuthorizeRole('lawyer', 'customer'), filterCurrentCase);

// Route to filter current cases for admin
router.get('/filterCurrentCaseAdmin', Auth, AuthorizeRole('admin'), filterCurrentCaseAdmin);

// Route to filter completed cases (win or lose) for the current user
router.get('/filterCompletedCases', Auth, AuthorizeRole('lawyer', 'customer'), filterCompletedCases);

// Route to filter completed cases (win or lose) for admin
router.get('/filterCompletedCasesAdmin', Auth, AuthorizeRole('admin'), filterCompletedCasesAdmin);

// Route to filter pending cases for the current user
router.get('/filterPendingCases', Auth, AuthorizeRole('lawyer', 'customer'), filterPendingCases);

// Route to filter pending cases for admin
router.get('/filterPendingCasesAdmin', Auth, AuthorizeRole('admin'), filterPendingCasesAdmin);

// Route to get the count of cases
router.get('/caseCount', Auth, countCases);

// Get all cases for user (lawyer or customer) by statistics (day, month, year)
router.get('/statistics', Auth, getCaseStatistics);

// Get all cases for user (lawyer or customer) by statistics (day, month, year)
router.get('/lawyer-case-counts/:id', Auth, getLawyerCaseCountsByMonth);

// Get the status history of a case
router.get('/:caseId/status-history', getCaseStatusHistory);

module.exports = router;
