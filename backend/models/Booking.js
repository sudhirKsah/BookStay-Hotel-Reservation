const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        require: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        require: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Booking = new mongoose.model('Booking', bookingSchema);

module.exports = Booking;