const Joi = require('joi');

const userValidationSchema = Joi.object({
    role: Joi.string().valid('customer', 'lawyer').required(),
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).required(),
    phone_number: Joi.string().max(15).required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords must match',
    }),
    personal_image: Joi.binary(),
    national_number: Joi.string()
    .max(20).allow(null).allow('').when('role', {
        is: 'lawyer',
        then: Joi.valid(null).messages({
            'any.only': 'National number must be null for lawyers',
        }),
        otherwise: Joi.required(),
    }),

      

});

module.exports = userValidationSchema;
