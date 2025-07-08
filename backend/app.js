// Importa las dependencias principales
const express = require('express');
const router = require("./routes"); 
const cors = require("cors");
const path = require('path');
const { getConfig } = require('./config/index');

// Inicializa la aplicación de Express
const app = express();

// Middlewares para parsear JSON en las peticiones y para habilitar CORS
app.use(express.json());
app.use(cors());

// Middleware para parsear datos de formularios (urlencoded)
app.use(express.urlencoded({ extended: true }));

// Monta el router principal bajo el prefijo /api
app.use("/api", router);
// Sirve archivos estáticos (imágenes) desde la carpeta configurada en IMAGE_PATH
app.use('/uploads', express.static(path.join(__dirname, getConfig("IMAGE_PATH"))));

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Manejo específico para errores de autorización JWT
  if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ error: 'Token inválido o expirado' });
  }
  
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;