require('dotenv').config();
const connection = require("./config/db");

const http = require('node:http');
const app = require('./app');

const server = http.createServer(app);

const connectDB = async () => {
  try {
      await connection.authenticate();
      console.log("Connected to the database");
  } catch (error) {
      console.log(error);
  }
}

server.listen(process.env.PORT, () => {
  connectDB();
  console.log(`creating server at http://localhost:${process.env.PORT}`);
});