import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import config from './config/config.js';


dotenv.config();

const app = express();
const PORT = config.app.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


app.get('/', (req, res) => {
    res.send('HOLA GENTEE!!!');
})

