// src/lib/server.js

const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");
const config = require("../../config");

const server = Hapi.server({
  port: config.app_port,
  host: config.app_url
});

exports.init = async () => {
  await server.initialize();

  // Register Security
  await server.register([require("hapi-auth-jwt2")]);
  server.auth.strategy("jwt", "jwt", {
    key: config.secret,
    validate: require("../util/authFunctions").validate,
    verifyOptions: {
      algorithms: ["HS256"]
    }
  });
  server.auth.default("jwt");

  // Register Routes
  server.route(require("../routes/user.route"));
  server.route(require("../routes/auth.route"));

  // Create DB Connection
  mongoose.set("useCreateIndex", true);
  mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
      throw err;
    }
  });

  return server;
};

exports.start = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
