// models/role.js
const { DataTypes } = require('sequelize');

module.exports = (connection) => {
  return connection.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'roles',
    timestamps: false
  });
};
