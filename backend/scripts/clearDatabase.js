require('dotenv').config();
const { 
    connection, 
    User, 
    Role,
    Product, 
    Category,
    Subcategory,
    Action,
    Sale,
    SaleDetail,
    UserActionLog
} = require('../models');


async function clearDatabase() {
    const modelTableMap = [
        { model: UserActionLog, table: 'user_action_logs' },
        { model: SaleDetail, table: 'sale_details' },
        { model: Sale, table: 'sales' },
        { model: Product, table: 'products' },
        { model: User, table: 'users' },
        { model: Subcategory, table: 'subcategories' },
        { model: Category, table: 'categories' },
        { model: Role, table: 'roles' },
        { model: Action, table: 'actions' }
    ];

  try {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const { model, table } of modelTableMap) {
        await model.destroy({ where: {}, force: true });
        await connection.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
        console.log(`Datos de ${model.name} borrados`);
    }

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Base de datos limpiada exitosamente y contadores reiniciados');
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
  } finally {
    await connection.close();
  }
}

clearDatabase(); 