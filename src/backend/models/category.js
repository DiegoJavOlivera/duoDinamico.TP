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
        }
    },{
        tableName: 'categories',
        timestamps: false,
        underscored: true,
    })

}