const  QuestionAnswer  = require('../models/questionAnswerModel');

// Controller function to create a new question-answer
async function createQuestionAnswer(req, res) {
    const { question, answer } = req.body;
    try {
        const userId = req.user.id
        console.log(userId)
        // Create a new QuestionAnswer record using Sequelize's create method
        const newQuestionAnswer = await QuestionAnswer.create({
            
            question,
            answer,
            userID :userId
        });

        // Respond with the newly created QuestionAnswer object
        res.status(201).json(newQuestionAnswer);
    } catch (err) {
        // Handle any errors that occur during creation
        console.error(err);
        res.status(500).json({ error: 'Error creating question and answer' });
    }
}

// Controller function to get all question-answers
async function getAllQuestionAnswers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const { count, rows } = await QuestionAnswer.findAndCountAll({
            limit: limit,
            offset: (page - 1) * limit,
        });

        res.status(200).json({
            totalItems: count,
            currentPage: page,
            limit: limit,
            questionAnswers: rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching question-answers' });
    }
}

// Controller function to get a specific question-answer by ID
async function getQuestionAnswer(req, res) {
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
}

// Controller function to update a question-answer
async function updateQuestionAnswer(req, res) {
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
}

// Controller function to delete a question-answer
async function deleteQuestionAnswer(req, res) {
    const { id } = req.params;
    try {
        const questionAnswer = await QuestionAnswer.findByPk(id);
        if (!questionAnswer) {
            return res.status(404).json({ error: 'Question-answer not found' });
        }
        await questionAnswer.destroy();
        res.status(200).json({ message: 'questionAnswer deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting question-answer' });
    }
}

module.exports = {
    createQuestionAnswer,
    getAllQuestionAnswers,
    getQuestionAnswer,
    updateQuestionAnswer,
    deleteQuestionAnswer,
};
