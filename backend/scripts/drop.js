/**
 * Script para eliminar todas las tablas de la base de datos.
 * Uso: node scripts/drop.js
 */
require('dotenv').config();
const { connection } = require('../models');

/**
 * Elimina todas las tablas de la base de datos.
 */
async function clearDatabase() {
  try {
    await connection.drop(); 
    console.log('¡Todas las tablas han sido eliminadas!');
    process.exit(0);
  } catch (error) {
    console.error('Error al borrar las tablas:', error);
    process.exit(1);
  }
}

clearDatabase();