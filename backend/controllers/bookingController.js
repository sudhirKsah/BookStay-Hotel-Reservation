const Booking = require('../models/Booking');
const Room = require('../models/Room');

const bookRoom = async(req, res) => {
    const { checkIn, checkOut, totalPrice } = req.body;
    try{
        const room = await Room.findById(req.params.id);
        if(!room){
           return res.redirect('/hotel/rooms', { message: "Room not found! "});
        }

        // check room availability
        const existingBookings = await Booking.find({
            room: req.params.id,
            $or: [
                { checkIn: { $lte: checkOut }, checkOut: { $gte: checkIn } },
                { checkIn: { $lte: checkIn }, checkOut: { $gte: checkIn } },
                { checkIn: { $lte: checkOut }, checkOut: { $gte: checkOut } },
            ],
        });

        if(existingBookings.length >= room.count){
            return res.status(400).redirect('to same link', { message: "No available room"});
        }

        const booking = new Booking({
            guest: req.user._id,
            room: req.params.id,
            hotel: room.hotel,
            checkIn,
            checkOut,
            totalPrice,
        });
        const createdBooking = await booking.save();
        res.status(201).redirect('booked page', { message: "Booking successful!"});
    }
    catch(error){
        console.error(error);
    }
};

module.exports = { bookRoom };