const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const route = require('./routes/Route.js');
const path = require('path');

const app = express();
// app.use(bodyparser.json());
const limit = 50 * 1024 * 1024;

app.use(bodyparser.json({ limit }));
app.use(bodyparser.urlencoded({ extended: true, limit }));



app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 7000;
const URL = process.env.MONGODB_URI;

mongoose.connect(URL)
.then(()=>{
    console.log("db connected...");

    app.listen(PORT, ()=>{
        console.log(`Server is running on port: ${PORT}`);
    })
})
.catch((err) => console.error("Error while connecting to db...",err));

app.use('/api',route);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
