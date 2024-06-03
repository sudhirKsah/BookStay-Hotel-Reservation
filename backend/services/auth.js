require('dotenv').config();
const JWT = require('jsonwebtoken');

const secret = process.env.SECRET;

function generateToken(user){
    const payload = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
    }
    const token = JWT.sign(payload, secret, { expiresIn: '30d' });
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = { generateToken, validateToken };