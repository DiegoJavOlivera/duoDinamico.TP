/**
 * @fileoverview Modelo Sequelize para la tabla 'users'.
 * Representa un usuario del sistema.
 *
 * Campos:
 * - id: Identificador único, entero, autoincremental.
 * - name: Nombre del usuario.
 * - email: Email único del usuario.
 * - password: Contraseña hasheada.
 * - is_active: Estado de actividad del usuario.
 * - role_id: Relación con el rol del usuario.
 */
const { DataTypes } = require('sequelize');

module.exports = (connection) => {
  return connection.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
  }, {
    tableName: 'users',
    timestamps: true, 
    underscored: true
  });
};
