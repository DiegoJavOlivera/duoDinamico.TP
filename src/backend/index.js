require('dotenv').config();

const http = require('node:http');
const app = require('./app');

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`creating server at http://localhost:${process.env.PORT}`);
});