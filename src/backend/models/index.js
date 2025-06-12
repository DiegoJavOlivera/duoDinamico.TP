const { Sequelize } = require('sequelize');
require('dotenv').config();

const UserModel = require('./user');
const RoleModel = require('./role');

const name = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const db = process.env.DB_DIALECT;

const connection = new Sequelize(name, user, password, { host: host, dialect: db });

const User = UserModel(connection);
const Role = RoleModel(connection);

Role.hasMany(User, { foreignKey: 'role_id' });

// un usuario pertenece a un rol
User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = {
  connection,
  User,
  Role,
};
