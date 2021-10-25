const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: false,
        default: ""
    },
    text: {
        type: String,
        required: false,
        default: ""
    },
    ratings: {
        type: [{icon: String, rating: Number}],
        required: true
    },
    image: [{
       name: String,
       contentType: String,
       data: Buffer
    }],
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

module.exports = mongoose.model('Review', reviewSchema);