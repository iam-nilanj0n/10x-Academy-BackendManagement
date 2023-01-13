const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
dotenv.config()

// for json use
app.use(express.json());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));

// mongoose connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.LOCAL_DATABASE,()=>{
    try {
        console.log('Database is connected');
    } catch (error) {
        console.log('Database connection failed', error)
    }
})
// Routes
const classRouter = require('./routes/classRoute');

app.use('/v1', classRouter)
// port and connection
const port = 5000;

app.listen(port,()=>{console.log(`Express server is running on PORT:${port}`);})