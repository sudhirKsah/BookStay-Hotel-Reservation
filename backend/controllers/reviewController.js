const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

const addReview = async(req, res) => {
    const { rating, comment } = req.body;

    try{
        const hotel = await Hotel.findById(req.params.id);

        if(!hotel){
            return res.status(404).redirect('/same page', {message: "Hotel not found"});
        }

        const isBooked = await Booking.findOne({
            guest: req.user._id,
            hotel: req.params.id,
        });

        if(!isBooked){
            return res.status(403).json("cannot write review");
        }

        const review = new Review({
            guest: req.user._id,
            hotel: req.params.id,
            rating,
            comment,
        })

        await review.save();
    }
    catch(error){
        console.error(error);
    }
};

const getReviews = async(req, res) => {
    const reviews = await Review.find({ hotel: req.params.id });
    res.json(reviews);
};

module.exports = { addReview, getReviews };