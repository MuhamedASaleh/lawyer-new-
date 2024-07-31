const QuestionAnswer = require('../models/questionAnswerModel');
const asyncHandler = require('express-async-handler');

// Controller function to create a new question-answer
exports.createQuestionAnswer = asyncHandler(async (req, res) => {
    const { question, answer } = req.body;
    const userId = req.user.id;

    try {
        // Create a new QuestionAnswer record
        const newQuestionAnswer = await QuestionAnswer.create({
            question,
            answer,
            userID: userId
        });

        // Respond with the newly created QuestionAnswer object
        res.status(201).json(newQuestionAnswer);
    } catch (err) {
        // Handle any errors that occur during creation
        console.error(err);
        res.status(500).json({ error: 'Error creating question and answer' });
    }
});

// Controller function to get all question-answers with 'accepted' status
exports.getAcceptedQuestionAnswers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { count, rows } = await QuestionAnswer.findAndCountAll({
        where: { status: 'accept' },
        limit,
        offset: (page - 1) * limit,
    });

    res.status(200).json({
        totalItems: count,
        currentPage: page,
        limit,
        questionAnswers: rows
    });
});

// Controller function to get all question-answers with 'pending' status
exports.getPendingQuestionAnswers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { count, rows } = await QuestionAnswer.findAndCountAll({
        where: { status: 'pending' },
        limit,
        offset: (page - 1) * limit,
    });

    res.status(200).json({
        totalItems: count,
        currentPage: page,
        limit,
        questionAnswers: rows
    });
});

// Controller function to update the status of a question-answer
exports.updateStatus = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const newStatus = req.body.status; // Get new status from request body

    const questionAnswer = await QuestionAnswer.findByPk(id);

    if (!questionAnswer) {
        return res.status(404).json({ error: 'QuestionAnswer not found' });
    }

    if (newStatus === 'reject') {
        // Delete the record if status is 'reject'
        await questionAnswer.destroy();
        return res.status(200).json({
            message: 'QuestionAnswer deleted successfully'
        });
    }

    if (newStatus === 'accept' && questionAnswer.status === 'pending') {
        // Update the status if it's being changed from 'pending' to 'accept'
        questionAnswer.status = newStatus;
        await questionAnswer.save();
        return res.status(200).json({
            message: 'Status updated successfully',
            questionAnswer
        });
    }

    return res.status(400).json({ error: 'Invalid status update' });
});

// Controller function to get a specific question-answer by ID
exports.getQuestionAnswer = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const questionAnswer = await QuestionAnswer.findByPk(id);
        if (!questionAnswer) {
            return res.status(404).json({ error: 'Question-answer not found' });
        }
        res.status(200).json(questionAnswer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching question-answer' });
    }
});

// Controller function to update a question-answer
exports.updateQuestionAnswer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;

    try {
        const questionAnswer = await QuestionAnswer.findByPk(id);
        if (!questionAnswer) {
            return res.status(404).json({ error: 'Question-answer not found' });
        }
        await questionAnswer.update({ question, answer });
        res.status(200).json(questionAnswer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating question-answer' });
    }
});

// Controller function to delete a question-answer
exports.deleteQuestionAnswer = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const questionAnswer = await QuestionAnswer.findByPk(id);
        if (!questionAnswer) {
            return res.status(404).json({ error: 'Question-answer not found' });
        }
        await questionAnswer.destroy();
        res.status(200).json({ message: 'QuestionAnswer deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting question-answer' });
    }
});
