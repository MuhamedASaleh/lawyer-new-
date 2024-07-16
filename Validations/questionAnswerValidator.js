const Joi = require('joi');

const createQuestionAnswerSchema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
});

const updateQuestionAnswerSchema = Joi.object({
    question: Joi.string(),
    answer: Joi.string(),
});

module.exports = {
    createQuestionAnswerSchema,
    updateQuestionAnswerSchema,
};
