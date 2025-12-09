const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        default: '0'
    },
    reviews: {
        type: String,
        default: '0'
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    hours: {
        type: String,
        default: 'Open 24 hours'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hospital', hospitalSchema);
