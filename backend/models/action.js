/**
 * @fileoverview Modelo Sequelize para la tabla 'actions'.
 * Representa una acción que puede realizar un usuario en el sistema (ej: crear producto, modificar estado, etc).
 *
 * Campos:
 * - id: Identificador único, entero, autoincremental.
 * - name: Nombre único de la acción.
 */
const {DataTypes} = require('sequelize');

module.exports = (connection) => {
    return connection.define('Action', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    },{
        tableName: 'actions',
        timestamps: false,
        underscored: true,
    })
}