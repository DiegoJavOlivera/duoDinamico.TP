const {DataTypes} = require('sequelize');

module.exports = (connection) =>{
    return connection.define('sale', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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