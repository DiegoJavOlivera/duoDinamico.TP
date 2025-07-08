/**
 * @fileoverview Modelo Sequelize para la tabla 'sales'.
 * Representa una venta realizada en el sistema.
 *
 * Campos:
 * - id: Identificador único, entero, autoincremental.
 * - ticket_code: Código único del ticket de venta.
 * - customer_name: Nombre del cliente.
 * - total: Total de la venta.
 * - created_at: Fecha de creación de la venta.
 */
const {DataTypes} = require('sequelize');

module.exports = (connection) =>{
    return connection.define('sale', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ticket_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
        },
        customer_name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        total:{
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: 'sales',
        timestamps: false, 
        underscored: true
    })
}