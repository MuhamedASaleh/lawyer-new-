const router = require('express').Router()
const caseController = require('../controllers/caseController');
// const validate = require('../middleware/validateRequest')
const {Auth , AuthorizeRole} = require('../middleware/auth')
// Route to create a new case
router.post('/create', Auth, AuthorizeRole('lawyer'), caseController.createCase);

// Route to get case details
router.get('/:caseId/details', caseController.getCaseDetails);

// Route to update case status (for customers only)
router.put('/:caseId/updateStatus', caseController.updateCaseStatus);

// Route to update customer files (for customers only)
router.put('/:caseId/updateCustomerFiles',caseController.updateCustomerFiles);

module.exports = router;
