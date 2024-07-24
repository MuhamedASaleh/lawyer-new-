const router = require('express').Router()

const { filterCurrentCase, filterCurrentCaseAdmin ,createCase,getCaseDetails,updateCaseStatus,updateCustomerFiles} = require('../controllers/caseController')

const { Auth, AuthorizeRole } = require('../middleware/auth')
// Route to create a new case
router.post('/create', Auth, AuthorizeRole('lawyer'),createCase);

// Route to get case details
router.get('/:caseId/details', getCaseDetails);

// Route to update case status to accepted(for customers only)
router.put('/:caseId/updateStatus', caseController.updateCaseStatus);

// Route to decline and delete a case
// router.delete('/:caseId/declineAndDelete', Auth, caseController.declineAndDeleteCase);;

// Route to update customer files (for customers only)
router.put('/:caseId/updateCustomerFiles',caseController.updateCustomerFiles)


module.exports = router;
