const express = require('express');
const router = require("./routes");
const cors = require("cors");
const path = require('path');
const { getConfig } = require('./config/index');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use('/uploads', express.static(path.join(__dirname, getConfig("IMAGE_PATH"))));

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ error: 'Token inválido o expirado' });
  }
  
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;