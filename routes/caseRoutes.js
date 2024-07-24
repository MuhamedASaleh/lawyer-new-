const router = require('express').Router();
const { 
  filterCurrentCase, 
  filterCurrentCaseAdmin,
  filterCompletedCases, 
  filterCompletedCasesAdmin,
  createCase, 
  getCaseDetails, 
  updateCaseStatus, 
  updateCustomerFiles 
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
router.get('/filterCurrentCase', Auth,AuthorizeRole('lawyer','customer'), filterCurrentCase);

// Route to filter current cases for admin
router.get('/filterCurrentCaseAdmin', Auth, AuthorizeRole('admin'), filterCurrentCaseAdmin);

// Route to filter completed cases (win or lose) for the current user
router.get('/filterCompletedCases', Auth,AuthorizeRole('lawyer','customer') ,filterCompletedCases);

// Route to filter completed cases (win or lose) for admin
router.get('/filterCompletedCasesAdmin', Auth, AuthorizeRole('admin'), filterCompletedCasesAdmin);

module.exports = router;
