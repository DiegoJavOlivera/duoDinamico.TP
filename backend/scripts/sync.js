require('dotenv').config();
/**
 * Script para sincronizar los modelos de la base de datos.
 * Elimina y vuelve a crear todas las tablas según los modelos definidos (force: true).
 * Uso: node scripts/sync.js
 */
const connection = require('../config/db');

(async () => {
  try {
    console.log('Sincronizando modelos...');
    // Sincroniza todos los modelos, eliminando las tablas existentes
    await connection.sync({ force: true }); 
    console.log('Modelos sincronizados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al sincronizar:', error);
    process.exit(1);
  }
})();
