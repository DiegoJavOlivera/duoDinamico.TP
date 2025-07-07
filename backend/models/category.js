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