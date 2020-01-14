// src/routes/user.routes.js

const userController = require("../controllers/user.controller");
const userSchema = require("./requestSchema/user.schema");
const verifyUniqueUser = require("../util/userFunctions").verifyUniqueUser;

module.exports = [
  {
    path: "/api/user",
    method: "GET",
    handler: (req, reply) => {
      return reply.response("IT WORKS").code(200);
    }
  },
  {
    path: "/api/user",
    method: "POST",
    config: {
      pre: [
        { method: verifyUniqueUser }
      ],
      handler: userController.createUser,
      validate: {
        payload: userSchema.createUser
      }
    }
  }
];
