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
var DB_NAME = process.env.EXPRESS_DB_NAME || 'bluestonepim_task_production';
const DB_URL = process.env.EXPRESS_DB_URL || 'localhost/';
if(process.env.EXPRESS_ENV==='dev') DB_NAME='dev';


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

/**
 * get a product by its id
 */
app.get('/products/:id', function (req, res) {
   Product.findById(req.params.id)
       .catch(error => handleError(error, res))
       .then(product => res.status(200).json(product));
});

/**
 * create a new product
 */
app.post('/products', function(req, res){
    new Product(req.body).save()
        .catch(error => handleError(error, res))
        .then(product => res.status(201).json(product));
});

/**
 * update a product by id
 */
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

/**
 * deletes all Products from the DB and creates some dummy products for development
 */
function prefillDB(){
    if(process.env.EXPRESS_ENV!=='dev') return;
    console.log('API runs in development mode. DB_NAME: '+ DB_NAME + 'DB will be cleared and dummy products will be created.')
    Product.remove().then(() => console.log('All products removed'));
    const dummyProducts = [
        {
            name: 'Product 1'
            ,number: 1
            ,description: 'Lorem ipsum dolor sit amet ipsum. Nulla in lacus a lacus. Ut id mollis luctus. Sed mattis. Nunc id nulla ut orci ac nisl. Sed fringilla purus at metus. Aliquam malesuada augue eu orci blandit suscipit, velit ac diam. Morbi tellus. Nulla diam a lorem id sapien. Nam nec leo.'
            ,images: [
                {
                    name: 'Dog',
                    url: 'https://i.imgur.com/HSHs7UF.png'
                },
                {
                    name: 'Cat',
                    url: 'https://i.imgur.com/GOeLLoJ.jpg'
                }
            ]
        },
        {
            name: 'Product 2'
            ,number: 2
            ,description: 'Lorem ipsum dolor sit amet ipsum. Nulla in lacus a lacus. Ut id mollis luctus. Sed mattis. Nunc id nulla ut orci ac nisl. Sed fringilla purus at metus. Aliquam malesuada augue eu orci blandit suscipit, velit ac diam. Morbi tellus. Nulla diam a lorem id sapien. Nam nec leo.'
            ,images: [
                {
                    name: 'Dog',
                    url: 'https://i.imgur.com/HSHs7UF.png'
                },
                {
                    name: 'Cat',
                    url: 'https://i.imgur.com/GOeLLoJ.jpg'
                }
            ]
        }
    ]
    new Product(dummyProducts[0]).save()
        .then(() => console.log('Product 1 created'))
        .catch(error => console.log(error));
    new Product(dummyProducts[1]).save()
        .then(() => console.log('Product 2 created'))
        .catch(error => console.log(error));
}

//start server
app.listen(PORT, function(){
    console.log('BluestonePIM recruitment task API is listening on port '+PORT);
    prefillDB();
});

