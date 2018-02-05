"use strict"

//libs
const express = require('express');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const bluebird = require('bluebird');
const cors = require('cors');

//models
const Product = mongoose.model('Product', require('./models/Product'));

//environment
const PORT = process.env.EXPRESS_PORT || 8000;
const DB_NAME = process.env.EXPRESS_DB_NAME || 'bluestonepim_task_production';
const DB_URL = process.env.EXPRESS_DB_URL || 'localhost/'


const app = express();
app.use(body_parser.json());
app.use(cors());

//set mongoose promise library
mongoose.Promise = bluebird;

//setup db connection
mongoose.connect('mongodb://' + DB_URL + DB_NAME);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));


/**
 * middleware that logs the request method and path
 */
const request_logger = function(req, res, next){
    console.log(req.method + ' on ' + req.path);
    next();
}

/**
 * handles errors
 *
 * @param error
 * @param res
 */
function handleError(error, res) {
    res.status(500).send(error);
}

app.use(request_logger);

//routes
app.get('/', function(req, res) {
    res.send('<h1>BluestonePIM recruitment task API</h1>');
});

/**
 * get all products
 */
app.get('/products', function(req, res){
    Product.find()
        .catch(error => handleError(error, res))
        .then(products => res.status(200).send(products));
});

app.get('/products/:id', function (req, res) {
   Product.findById(req.params.id)
       .catch(error => handleError(error, res))
       .then(product => res.status(200).json(product));
});

app.post('/products', function(req, res){
    new Product(req.body).save()
        .catch(error => handleError(error, res))
        .then(product => res.status(201).json(product));
});

app.put('/products/:id', function(req, res){
    Product.findById(req.params.id)
        .catch(error => handleError(error, res))
        .then(product => {
           product.name = req.body.name || product.name;
           product.number = req.body.number || product.number;
           product.description = req.body.description || product.description;
           product.images = req.body.images || product.images;
           product.save()
               .catch(error => handleError(error, res))
               .then(product => res.status(200).json(product));
        });
});


app.listen(PORT, function(){
    console.log('BluestonePIM recruitment task API is listening on port '+PORT)
});

