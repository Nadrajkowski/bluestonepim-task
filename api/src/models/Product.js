"use scrict"

const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        number: {type: Number, required: true},
        description: {type: String, required: true},
        images: {default: [], type: [{
            name: String,
            url: String,
            id: {
                type: String,
                default: "bluestonepim_image_" + mongoose.Types.ObjectId()
            }
        }]}
    },
    {
        timestamps: true
    }
);

module.exports = productSchema;
