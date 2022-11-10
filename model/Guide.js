const mongoose = require('mongoose');

const schema = mongoose.Schema;

const guideSchema = new schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,

    },
    emailToken: {
        type: String,

    },

    number: {
        type: Number
    },

    timestamp: {
        type: String,
        default: Date.now
    },

    fees: {
        type: Number,
        default: 0
    },
    place: {
        type: String,
    }


});

const Guide = mongoose.model('Guide', guideSchema);

module.exports = Guide;