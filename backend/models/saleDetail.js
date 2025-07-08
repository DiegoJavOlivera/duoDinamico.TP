/**
 * @fileoverview Modelo Sequelize para la tabla 'sale_details'.
 * Representa el detalle de cada producto vendido en una venta.
 *
 * Campos:
 * - id: Identificador único, entero, autoincremental.
 * - quantity: Cantidad de productos vendidos.
 * - subtotal: Subtotal por este producto.
 * - created_at: Fecha de creación del detalle.
 * - product_id: Relación con producto vendido.
 * - sale_id: Relación con la venta.
 */
const {DataTypes} = require('sequelize');

module.exports = (connection) => {
    return connection.define('SaleDetail',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
            validate: {
                min: 1
            },
        },
        subtotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isFloat: true,
                min: 0.01
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            }
        },
        sale_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'sales',
                key: 'id',
            }
        }

    },{
        tableName: 'sale_details',
        timestamps: false, 
        underscored: true
    })
}