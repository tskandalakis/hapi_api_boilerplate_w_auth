// src/routes/requestSchema/user.schema.js

const Joi = require("@hapi/joi");

module.exports = {
  createUser: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    admin: Joi.boolean().required()
  })
};
