"use scrict"

const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        id: {type: String, required: true, default: "bluestonepim_image_"+Date.now()},
        name: {type: String, required: true},
        number: {type: Number, required: true},
        description: {type: String, required: true},
        images: {default: [], type: [{name: String, url: String}]}
    },
    {
        timestamps: true
    }
);

module.exports = productSchema;
