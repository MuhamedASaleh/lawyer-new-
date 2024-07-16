const { QuestionAnswer } = require('../models/questionAnswerModel');

// Controller function to create a new question-answer
async function createQuestionAnswer(req, res) {
    const { question, answer } = req.body;
    try {
        const newQuestionAnswer = await QuestionAnswer.create({ question, answer });
        res.status(201).json(newQuestionAnswer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating question and answer' });
    }
}

// Controller function to get all question-answers
async function getAllQuestionAnswers(req, res) {
    try {
        const questionAnswers = await QuestionAnswer.findAll();
        res.status(200).json(questionAnswers);
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
        res.status(204).json();
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
