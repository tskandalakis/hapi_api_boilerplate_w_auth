// src/util/userFunctions.js

const Boom = require("@hapi/boom");
const User = require("../model/User");
const { ObjectId } = require("mongoose").Types.ObjectId;

async function verifyUniqueUser (req, h) {
  const user = await User.findOne({
    email: req.payload.email
  });

  if (user) {
    throw Boom.badRequest("Email taken");
  }

  return h.continue;
}

async function findById (id) {
  try {
    return await User.findById({
      _id: new ObjectId(id)
    });
  } catch (err) {
    throw Boom.badImplementation();
  }
}

async function findByEmail (email) {
  try {
    return await User.findOne({
      email: email
    });
  } catch (err) {
    throw Boom.badImplementation();
  }
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser,
  findById: findById,
  findByEmail: findByEmail
};
