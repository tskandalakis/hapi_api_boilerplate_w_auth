// src/util/authFunctions.js

const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userFunctions = require("./userFunctions");
const config = require("../../config");

async function hashPassword (password) {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch (err) {
    if (err.isBoom) throw err;
    else throw Boom.badImplementation();
  }
}

function createAccessToken (user) {
  try {
    let scopes;

    if (user.admin) {
      scopes = "admin";
    }
    return jwt.sign({ id: user._id, email: user.email, name: user.name, scope: scopes }, config.secret, { algorithm: "HS256", expiresIn: "15m" });
  } catch (err) {
    if (err.isBoom) throw err;
    else throw Boom.badImplementation();
  }
}

async function refreshAccessToken (refreshToken) {
  try {
    const decoded = await jwt.verify(refreshToken, config.secret, { algorithms: ["HS256"] });
    return createAccessToken(await userFunctions.findById(decoded.id));
  } catch (err) {
    if (err.isBoom) throw err;
    else throw Boom.unauthorized("Invalid token");
  }
}

function createRefreshToken (user) {
  try {
    return jwt.sign({ id: user._id }, config.secret, { algorithm: "HS256", expiresIn: "24h" });
  } catch (err) {
    if (err.isBoom) throw err;
    else throw Boom.badImplementation();
  }
}

async function verifyLogin (req, h) {
  try {
    const user = await userFunctions.findByEmail(req.payload.email);

    if (!user) {
      throw new Error();
    }

    const isValid = await bcrypt.compare(req.payload.password, user.password);
    if (isValid) {
      return user;
    } else {
      throw new Error();
    }
  } catch (err) {
    if (err.isBoom) throw err;
    else throw Boom.badRequest("Email or password are incorrect.");
  }
}

async function validate (decoded, request, h) {
  return { isValid: true };
};

module.exports = {
  hashPassword: hashPassword,
  verifyLogin: verifyLogin,
  createAccessToken: createAccessToken,
  refreshAccessToken: refreshAccessToken,
  createRefreshToken: createRefreshToken,
  validate: validate
};
