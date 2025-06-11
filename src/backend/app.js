const path = require('node:path');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const publicPath = path.join(__dirname, '..', '..', 'public');
const viewsPath = path.join(__dirname, 'views');

app.set('view engine', 'ejs');
app.set('views', viewsPath);

app.use("/public", express.static(publicPath));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.render('index', { title: 'hello world' });
});

module.exports = app;