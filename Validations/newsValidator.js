const Joi = require('joi');

const createNewsSchema = Joi.object({
    description: Joi.string().required(),
    image: Joi.binary().allow(null),
    // adminID: Joi.number().integer().required()
});

const updateNewsSchema = Joi.object({
    description: Joi.string().required(),
    image: Joi.binary().allow(null)
});

module.exports = {
    createNewsSchema,
    updateNewsSchema
};
