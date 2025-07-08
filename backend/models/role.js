/**
 * @fileoverview Modelo Sequelize para la tabla 'roles'.
 * Representa los roles de usuario en el sistema (admin, super admin, etc).
 *
 * Campos:
 * - id: Identificador único, entero, autoincremental.
 * - name: Nombre del rol.
 */

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
