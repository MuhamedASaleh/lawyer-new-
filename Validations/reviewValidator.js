const Joi = require('joi');

exports.createReviewSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      'number.base': '"rating" must be a number',
      'any.required': '"rating" is a required field'
    }),
    comment: Joi.string().required().messages({
      'comment.base': '"comment" must be a string',
      'any.required': '"comment" is a required field'
    })
  });
