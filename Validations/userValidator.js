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
    national_number: Joi.string(),
    .max(20).allow(null).allow('').when('role', {
        is: 'lawyer',
        then: Joi.valid(null).messages({
            'any.only': 'National number must be null for lawyers',
        }),
        otherwise: Joi.required(),
    }),
    lawyer_price: Joi.number().precision(2).allow(null).allow('').when('role', {
        is: 'customer',
        then: Joi.valid(null).messages({
            'any.only': 'Lawyer price must be null for customers',
        }),
        otherwise: Joi.required(),
    }),
    specializations: Joi.string().valid(
        'Criminal Law', 'Civil Law', 'Commercial Law', 'Family Law',
        'International Law', 'Labor Law', 'Intellectual Property Law',
        'Corporate Law', 'Administrative Law', 'Constitutional Law',
        'Tax Law', 'Environmental Law'
    ).allow(null).allow('').when('role', {
        is: 'customer',
        then: Joi.valid(null).messages({
            'any.only': 'Specializations must be null for customers',
        }),
        otherwise: Joi.required(),
    }),
    certification: Joi.binary().allow(null).allow('').when('role', {
        is: 'customer',
        then: Joi.valid(null).messages({
            'any.only': 'Certification must be null for customers',
        }),
        
    }),
});

module.exports = userValidationSchema;
