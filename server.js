const PORT = 3000;

const http = require('node:http');
const app = require('./app');

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`creating server at http://localhost:${PORT}`);
});