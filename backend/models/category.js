/**
 * @fileoverview Modelo Sequelize para la tabla 'categories'.
 * Representa una categoría de productos (ej: bebidas, accesorios).
 *
 * Campos:
 * - id: Identificador único, entero, autoincremental.
 * - name: Nombre único de la categoría.
 * - description: Descripción de la categoría (opcional).
 * - image: Ruta de la imagen representativa (opcional).
 */
const {DataTypes} = require('sequelize');

module.exports = (connection) => {
    return connection.define('Category',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },{
        tableName: 'categories',
        timestamps: false,
        underscored: true,
    })

}