require('dotenv').config();
const connection = require("./config/db");
const { getConfig } = require('./config');

const http = require('node:http');
const app = require('./app');

const server = http.createServer(app);
const port = getConfig('PORT');

const connectDB = async () => {
  try {
    await connection.authenticate();
    console.log("Connected to the database");
  } catch (error) {
    console.log(error);
  }
}

server.listen(port, () => {
  connectDB();
  console.log(`creating server at http://localhost:${port}`);
});