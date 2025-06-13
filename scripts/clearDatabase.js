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
} = require('../backend/models');

/**
 * Limpia la base de datos eliminando todos los registros y reiniciando los contadores AUTO_INCREMENT.
 * La función sigue estos pasos:
 * 1. Desactiva temporalmente las restricciones de clave foránea
 * 2. Elimina todos los registros de cada tabla en orden inverso a sus dependencias
 * 3. Reinicia el contador AUTO_INCREMENT de cada tabla
 * 4. Reactiva las restricciones de clave foránea
 * 
 * @async
 * @function clearDatabase
 * @throws {Error} Si ocurre algún error durante el proceso de limpieza
 * @returns {Promise<void>}
 */
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
    // Desactivar las restricciones de clave foránea temporalmente
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const { model, table } of modelTableMap) {
        await model.destroy({ where: {}, force: true });
        await connection.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
        console.log(`Datos de ${model.name} borrados`);
    }

    // Reactivar las restricciones de clave foránea
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Base de datos limpiada exitosamente y contadores reiniciados');
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
  } finally {
    await connection.close();
  }
}

clearDatabase(); 