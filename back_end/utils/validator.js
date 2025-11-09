const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'faculty').required(),
  rollNo: Joi.when('role', {
    is: 'student',
    then: Joi.string().min(2).max(50).required(),
    otherwise: Joi.forbidden()
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('student', 'faculty').required()
});

const questionSchema = Joi.object({
  subject: Joi.string().required(),
  questionText: Joi.string().required(),
  options: Joi.array().items(Joi.object({ text: Joi.string().required() })).min(2).required(),
  correctOptionIndex: Joi.number().integer().min(0).required(),
  marks: Joi.number().min(0).default(1),
  duration: Joi.number().min(5).max(600).default(60) // ✅ added validation for duration
});

module.exports = {
  registerSchema,
  loginSchema,
  questionSchema
};
