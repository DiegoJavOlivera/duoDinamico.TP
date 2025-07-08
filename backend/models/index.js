/**
 * @fileoverview Inicialización y asociación de modelos Sequelize.
 * Este archivo importa, inicializa y relaciona todos los modelos del sistema.
 * Exporta los modelos y la conexión para su uso en el resto de la aplicación.
 */
const connection = require('../config/db');

const UserModel = require('./user');
const RoleModel = require('./role');
const UserActionLogModel = require('./userActionLog');
const ProductModel = require('./product');
const CategoryModel = require('./category');
const ActionModel = require('./action');
const SaleModel = require('./sale');
const SaleDetailModel = require('./saleDetail');
const SubcategoryModel = require('./subcategory');

const User = UserModel(connection);
const Role = RoleModel(connection);
const UserActionLog = UserActionLogModel(connection);
const Product = ProductModel(connection);
const Category = CategoryModel(connection);
const Action = ActionModel(connection);
const Sale = SaleModel(connection);
const SaleDetail = SaleDetailModel(connection);
const Subcategory = SubcategoryModel(connection);

Product.belongsTo(Subcategory, { foreignKey: 'subcategory_id' });
Subcategory.hasMany(Product, { foreignKey: 'subcategory_id' });

Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

User.hasMany(UserActionLog, { foreignKey: 'user_id' });
UserActionLog.belongsTo(User, { foreignKey: 'user_id' });

UserActionLog.belongsTo(Action, { foreignKey: 'action_id' });
Action.hasMany(UserActionLog, { foreignKey: 'action_id' });

UserActionLog.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(UserActionLog, { foreignKey: 'product_id' });

SaleDetail.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(SaleDetail, { foreignKey: 'product_id' });

Sale.hasMany(SaleDetail, { foreignKey: 'sale_id' });
SaleDetail.belongsTo(Sale, { foreignKey: 'sale_id' });

Category.hasMany(Subcategory, { foreignKey: 'category_id' });
Subcategory.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = {
  connection,
  User,
  Role,
  UserActionLog,
  Product,
  Category,
  Action,
  Sale,
  SaleDetail,
  Subcategory
};
