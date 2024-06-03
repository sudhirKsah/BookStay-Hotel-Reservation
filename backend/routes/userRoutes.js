const express = require('express');
const { registerUser, login, logout, hotelOwnerProfile } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/logout', logout);

router.get('/hotelOwnerProfile', hotelOwnerProfile);

module.exports = router;