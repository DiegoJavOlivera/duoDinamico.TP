const http = require('node:http');
const config = require('./config');
const app = require('./app');

const server = http.createServer(app);

server.listen(config.env.port, () => {
  console.log(`creating server at http://localhost:${config.env.port}`);
});