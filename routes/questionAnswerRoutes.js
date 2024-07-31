const express = require('express');
const router = express.Router();
const {
    createQuestionAnswer,
    getQuestionAnswer,
    updateQuestionAnswer,
    deleteQuestionAnswer,
    getAcceptedQuestionAnswers,
    getPendingQuestionAnswers,
    updateStatus,
} = require('../controllers/questionAnswerController');

const { Auth, AuthorizeRole } = require('../middleware/auth');

// Create a new question-answer
router.post('/', Auth, createQuestionAnswer);

// Get all question-answers with 'accepted' status
router.get('/accepted', Auth, getAcceptedQuestionAnswers);

// Get all question-answers with 'pending' status
router.get('/pending', Auth, getPendingQuestionAnswers);

// Get a specific question-answer by ID
router.get('/:id', Auth, getQuestionAnswer);

// Update a question-answer
router.put('/:id', Auth, updateQuestionAnswer);

// Delete a question-answer
router.delete('/:id', Auth, deleteQuestionAnswer);

// Route for updating the status
router.put('/:id/status', Auth, AuthorizeRole('admin'), updateStatus);

module.exports = router;
