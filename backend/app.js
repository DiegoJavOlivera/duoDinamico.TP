const express = require('express');
const router = require("./routes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('hello worldsito');
});

app.use("/api", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ error: 'Token inválido o expirado' });
  }
  
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;