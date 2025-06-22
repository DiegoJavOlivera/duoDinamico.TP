require('dotenv').config();
const { connection } = require('../models');

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