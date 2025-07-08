// Carga las variables de entorno de env
require('dotenv').config();

const connection = require("./config/db");
const { getConfig } = require('./config');

// módulo HTTP nativo de Node.js y la app (express)
const http = require('node:http');
const app = require('./app');

// Crea el servidor HTTP utilizando la app de Express
const server = http.createServer(app);
const port = getConfig('PORT');

// Función asíncrona para conectar y autenticar la base de datos
const connectDB = async () => {
  try {
    await connection.authenticate(); 
    console.log("Connected to the database");
  } catch (error) {
    console.log(error);
  }
}

// Inicia el servidor en el puerto especificado y conecta la base de datos
server.listen(port, () => {
  connectDB();
  console.log(`creating server at http://localhost:${port}`);
});