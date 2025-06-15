const { Sequelize } = require('sequelize');
const { getConfig } = require('./index');

const name = getConfig('DB_NAME');
const user = getConfig('DB_USER');
const password = getConfig('DB_PASS');
const host = getConfig('DB_HOST');
const dialect = getConfig('DB_DIALECT');

const connection = new Sequelize(name, user, password, { 
    host: host, 
    dialect: dialect 
});

module.exports = connection;
