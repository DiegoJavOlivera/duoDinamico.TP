/**
 * @fileoverview Modelo Sequelize para la tabla 'user_action_logs'.
 * Registra cada acción realizada por un usuario sobre un producto.
 *
 * Campos:
 * - id: Identificador único, entero, autoincremental.
 * - user_id: Relación con el usuario que ejecutó la acción.
 * - product_id: Relación con el producto (opcional).
 * - action_id: Relación con la acción realizada.
 * - created_at: Fecha y hora de la acción.
 */
const {DataTypes} = require('sequelize');

module.exports = (connection) => {
    return connection.define('UserActionLog', {
        id: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: 'users',
                key: 'id',
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references:{
                model: 'products',
                key: 'id',
            }
        },
        action_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: 'actions',
                key: 'id',
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }

    },{
        tableName: 'user_action_logs',
        timestamps: false, 
        underscored: true,
    });
};