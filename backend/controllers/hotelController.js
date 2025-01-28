const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const folderPath = path.resolve(`../public/uploads/${req.user._id}`);
            fs.mkdirSync(folderPath, { recursive: true });
            cb(null, folderPath);
        },
        filename: function (req, file, cb) {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        }
    }),

    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, and GIF images are allowed!'), false);
        }
    }
});


const listHotels = async (req, res) => {
    const hotels = await Hotel.find({});
    // console.log(hotels);
    res.json(hotels);
};

// const getHotelDetails = async (req, res, next) => {
//     const hotelId = req.params.id;
//     try {
//         const hotel = await Hotel.findById(hotelId);
//         if (!hotel) {
//             return res.status(404).render('error', { message: 'Hotel not found' });
//         }
//         hotel.facilities = hotel.facilities[0].split(', '); 
//         req.hotel = hotel;
//         if (next) return next();
//         res.json(hotel);
//     } catch (error) {
//         console.error(error);
//         res.status(500).render('error', { message: 'Internal server error' });
//     }
// };

const getHotelDetails = async (req, res, next) => {
    const hotelId = req.params.id;
    console.log(`Fetching details for hotel ID: ${hotelId}`); // Debug log

    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            console.log('Hotel not found'); // Debug log
            return res.status(404).json({ message: 'Hotel not found' });
        }

        console.log(`Hotel found: ${hotel.name}`); // Debug log
        req.hotel = hotel;

        // If no next middleware, respond with JSON
        if (!next) return res.json(hotel);

        next();
    } catch (error) {
        console.error('Error fetching hotel:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const editHotelDetails = async (req, res) => {
    const hotelId = req.params.id;
    console.log(`Fetching details for hotel ID: ${hotelId}`); 

    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            console.log('Hotel not found'); // Debug log
            return res.status(404).json({ message: 'Hotel not found' });
        }

        console.log(`Hotel found: ${hotel.name}`);
        return res.json(hotel);

    } catch (error) {
        console.error('Error fetching hotel:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};



const addHotel = async (req, res) => {
    const { name, country, state, city, zipCode, description, facilities } = req.body;

    try {
        const imageUrls = req.files.map(file => `/uploads/${req.user._id}/${file.filename}`);

        const hotel = new Hotel({
            name,
            owner: req.user._id,
            country,
            state,
            city,
            zipCode,
            description,
            imagesUrl: imageUrls,
            facilities,
        });

        await hotel.save();
        res.redirect('/api/user/hotelOwnerProfile');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add hotel" });
    }
};




const updateHotel = async (req, res) => {
    const { name, country, state, city, zipCode, description, imagesUrl, facilities } = req.body;

    try {
        const hotel = await Hotel.findById(req.params.id);

        if (hotel) {
            hotel.name = name || hotel.name;
            hotel.country = country || hotel.country;
            hotel.state = state || hotel.state;
            hotel.city = city || hotel.city;
            hotel.zipCode = zipCode || hotel.zipCode;
            hotel.description = description || hotel.description;
            hotel.imagesUrl = imagesUrl || hotel.imagesUrl;
            hotel.facilities = facilities || hotel.facilities;

            const updatedHotel = await hotel.save();
            // console.log("update hotel", req.body);
            res.json({ message: "Hotel updated successfully!", hotel: updatedHotel });
        } else {
            res.status(404).json({ message: "Hotel not found!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
        console.error(error);
    }
};


const deleteHotel = async (req, res) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const findHotel = async (req, res) => {
    try {
        const hotel = await Hotel.find({ owner: req.user._id });
        // console.log(hotel);
        res.json({ hotel });
    }
    catch (error) {
        console.error(error);
    }
};

const listRooms = async (req, res) => {
    const hotel = req.hotel;
    if (!hotel) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    try {
        const rooms = await Room.find({ hotel: hotel._id });
        res.render('hotelDetails', { user: req.user, hotel, rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addRoom = async (req, res) => {
    const { type, price, count, facilities } = req.body;
    try {
        const room = new Room({
            hotel: req.params.id,
            type,
            price,
            count,
            facilities,
        });
        await room.save();
        res.redirect('/');
    }
    catch (error) {
        console.error(error);
    }
};

const updateRoom = async (req, res) => {
    const { type, price, count } = req.body;

    try {
        const room = await Room.findById(req.params.id);
        if (room) {
            room.type = type || room.type;
            room.price = price || room.price;
            room.count = count || room.count;
            room.facilities = facilities || room.facilities;

            const updatedRoom = await room.save();
            res.redirect('/hotel/rooms', { message: "Room updated successfully! " });
        } else {
            res.redirect('/hotel/rooms', { message: "Failed to update room! " });
        }
    }
    catch (error) {
        console.error(error);
    }
};

const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (room) {
            await room.remove();
            res.redirect('/hotel/rooms', { message: 'Room removed' });
        } else {
            res.status(404).redirect('/hotel/rooms', { message: 'Room not found' });
        }
    }
    catch (error) {
        console.error(error);
    }
};

module.exports = {
    listHotels,
    getHotelDetails,
    editHotelDetails,
    addHotel,
    updateHotel,
    deleteHotel,
    listRooms,
    addRoom,
    updateRoom,
    deleteRoom,
    upload,
    findHotel,
};