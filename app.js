const express = require('express');
const logger = require('morgan');
//Morgan is watching requests and printing in console
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express();

//Promise implementation used
mongoose.Promise = global.Promise; //ES6 implementation of Promises
//DB connection
mongoose.connect('mongodb://localhost/carssells');

//small security
app.use(helmet());

// Routes
const users = require('./routes/users');
const cars = require('./routes/cars');

//Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());

//Routes
app.use('/users', users);
app.use('/cars',cars);

//404 Erors and forward to error handlers
app.use((req,res,next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

//Error handlers
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    //Respond to client
    res.status(status).json({
        error: {
            message: error.message
        }
    })

    //Respond to ourselves
    console.error(err);
});

//Start 

const PORT = process.env.PORT || 2531
//listen 
app.listen(PORT, () => console.info(`Started on port ${PORT}`));

