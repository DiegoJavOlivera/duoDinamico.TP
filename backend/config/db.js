const { Sequelize } = require('sequelize');

const name = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const db = process.env.DB_DIALECT;

const connection = new Sequelize(name, user, password, { host: host, dialect: db });

module.exports = connection;
