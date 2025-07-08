/**
 * @fileoverview Modelo Sequelize para la tabla 'subcategories'.
 * Representa una subcategoría de productos.
 *
 * Campos:
 * - id: Identificador único, entero, autoincremental.
 * - name: Nombre único de la subcategoría.
 * - image: Ruta de la imagen representativa (opcional).
 * - description: Descripción de la subcategoría (opcional).
 * - category_id: Relación con la categoría principal.
 */
const {DataTypes} = require('sequelize');

module.exports = (connection) => {
    return connection.define('Subcategory', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id',
            },
        },
    },{
        tableName: 'subcategories',
        timestamps: false,
        underscored: true,
    })
}