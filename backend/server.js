require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDatabase = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authentication');
const Hotel = require('./models/Hotel');

const app = express();

connectDatabase();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../photos')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend'));

app.use(checkForAuthenticationCookie("token"));

app.get('/', async(req, res) => {
    const allHotels = await Hotel.find({});
    res.render('index', { user: req.user, hotels: allHotels });
});

app.get('/view/:view', (req, res) => {
    const view = req.params.view;
    res.render(view);
});

// Isolate the /payment route to avoid middleware issues
app.use('/api/hotel/payment', (req, res, next) => {
    const { hotelId, roomId } = req.query;
    if (!hotelId || !roomId) {
        return res.status(400).render('error', { message: 'Missing hotelId or roomId' });
    }
    console.log(`Hotel ID: ${hotelId}, Room ID: ${roomId}`);
    res.render('payment', { hotelId, roomId });
});

app.use('/api/user', userRoutes);
app.use('/api/hotel', hotelRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/review', reviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', { message: err.message || 'Internal Server Error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
