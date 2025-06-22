const { DataTypes} = require('sequelize');



module.exports = (connection) => {
    return connection.define('Product', {
        id:{
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
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 1.0,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        subcategory_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'subcategories',
                key: 'id',
            },
        }
    }, {
        tableName: 'products',
        timestamps: true,
        underscored: true,
    });
};