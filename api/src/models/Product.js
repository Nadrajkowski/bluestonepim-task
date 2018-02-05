"use scrict"

const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        number: {type: Number, required: true},
        description: {type: String, required: true},
        images: {default: [], type: [String]}
    },
    {
        timestamps: true
    }
);

module.exports = productSchema;
