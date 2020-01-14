// src/routes/requestSchema/auth.schema.js

const Joi = require("@hapi/joi");

module.exports = {
  login: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
  }),
  refresh: Joi.object({
    refresh_token: Joi.string()
      .required()
  })
};
