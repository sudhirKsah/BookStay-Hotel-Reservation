const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: '/profileImages/default.jpg' },
    role: { type: String, enum: ['guest', 'hotel-owner', 'admin'], default: 'guest' },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;

