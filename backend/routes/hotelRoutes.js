const express = require('express');
const {
    listHotels,
    getHotelDetails,
    addHotel,
    updateHotel,
    deleteHotel,
    listRooms,
    addRoom,
    updateRoom,
    deleteRoom,
    upload,
    findHotel,
} = require('../controllers/hotelController');
const router = express.Router();

router.route('/').get(listHotels);
router.route('/ownerHotel').get(findHotel);
router.route('/:id').get(getHotelDetails, listRooms);
// router.route('/:id/rooms').get(listRooms);
router.route('/addHotel').post(upload.array('imagesUrl', 10), addHotel);
router.put('/updateHotel/:id', updateHotel);
router.route('/deleteHotel/:id').delete(deleteHotel);


router.route('/:id/addRoom').post(addRoom);
router.route('/rooms/:id')
    .put(updateRoom)
    .delete(deleteRoom);

    // Route to render payment page
// router.get('/payment', (req, res) => {
//     const { hotelId, roomId } = req.query;
//     res.render('payment', { hotelId, roomId });
// });

// router.route('/payment').get((req, res) => {
//     const {hotelId, roomId } = req.query;
//     console.log(`Hotel ID: ${hotelId}, Room ID: ${roomId}`); // Add this line
//     res.render('payment', { hotelId, roomId});
// });

// Route to process payment (for simplicity, we just print the form data)
router.post('/process-payment', (req, res) => {
    const { name, cardNumber, expiryDate, cvv, roomId, hotelId } = req.body;
    console.log(`Payment Details:
        Name: ${name}
        Card Number: ${cardNumber}
        Expiry Date: ${expiryDate}
        CVV: ${cvv}
        Room ID: ${roomId}
        Hotel ID: ${hotelId}`);
    res.send('Payment processed');
});

module.exports = router;