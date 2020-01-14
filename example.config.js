// config.js
const config = {};

config.app_url = process.env.APP_URL || "localhost";
config.app_port = process.env.PORT || "3001";
config.secret = process.env.SECRET || "secretKey";
config.mongodb = process.env.MONGODB || "mongodb://localhost:27017/boilerplate";
config.env = process.env.ENV || "dev"; // dev or prod

module.exports = config;
