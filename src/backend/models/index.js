const { Sequelize } = require('sequelize');
require('dotenv').config();

const UserModel = require('./user');
const RoleModel = require('./role');
const UserActionLogModel = require('./userActionLog');
const ProductModel = require('./product');
const CategoryModel = require('./category');
const ActionModel = require('./action');
const SaleModel = require('./sale');
const SaleDetailModel = require('./saleDetail');
const SubcategoryModel = require('./subcategory');


const name = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const db = process.env.DB_DIALECT;

const connection = new Sequelize(name, user, password, { host: host, dialect: db });

const User = UserModel(connection);
const Role = RoleModel(connection);
const UserActionLog = UserActionLogModel(connection);
const Product = ProductModel(connection);
const Category = CategoryModel(connection);
const Action = ActionModel(connection);
const Sale = SaleModel(connection);
const SaleDetail = SaleDetailModel(connection);
const Subcategory = SubcategoryModel(connection);



Product.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Product, { foreignKey: 'category_id' });

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
  Subcategory,
};
