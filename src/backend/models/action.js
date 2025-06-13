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