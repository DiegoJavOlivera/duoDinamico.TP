require('dotenv').config();
const { connection } = require('../backend/models');

( async () => {
  try {
    console.log('Sincronizando modelos...');
    await connection.sync(); 
    console.log('Modelos sincronizados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al sincronizar:', error);
    process.exit(1);
  }
})();
