const express = require('express');
const router = express.Router();
const {
    createQuestionAnswer,
    getAllQuestionAnswers,
    getQuestionAnswer,
    updateQuestionAnswer,
    deleteQuestionAnswer,
} = require('../controllers/questionAnswerController');
const {
    validateCreateQuestionAnswer,
    validateUpdateQuestionAnswer,
} = require('../Validations/questionAnswerValidator');
const { Auth } = require('../middleware/auth')
// const validateRequest = require('../middleware/validateRequest');
// Create a new question-answer
router.post('/',Auth, createQuestionAnswer);

// Get all question-answers
router.get('/', getAllQuestionAnswers);

// Get a specific question-answer by ID
router.get('/:id', getQuestionAnswer);

// Update a question-answer
router.put('/:id', updateQuestionAnswer);

// Delete a question-answer
router.delete('/:id', deleteQuestionAnswer);

module.exports = router;
