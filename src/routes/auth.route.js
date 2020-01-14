// src/routes/auth.routes.js

const authController = require("../controllers/auth.controller");
const authSchema = require("./requestSchema/auth.schema");
const verifyLogin = require("../util/authFunctions").verifyLogin;

module.exports = [
  {
    path: "/api/auth/login",
    method: "POST",
    config: {
      auth: false,
      validate: {
        payload: authSchema.login
      },
      pre: [
        { method: verifyLogin, assign: "user" }
      ],
      handler: authController.login
    }
  },
  {
    path: "/api/auth/refresh",
    method: "POST",
    config: {
      validate: {
        payload: authSchema.refresh
      },
      handler: authController.refresh
    }
  }
];
