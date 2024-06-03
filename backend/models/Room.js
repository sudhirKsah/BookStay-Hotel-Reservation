const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        requied: true
    },
    count: {
        type: Number,
        required: true
    },
    roomImageUrl: {
        type: String,
        default: '/profileImages/room.jpg',
        required: true
    },
    facilities: {
        type: [String],
        required: true
    },
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;