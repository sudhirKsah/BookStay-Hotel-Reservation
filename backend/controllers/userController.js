const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { generateToken } = require('../services/auth');

const registerUser = async(req, res) => {
    // console.log(req.body);
    const { firstName, lastName, email, password, role } = req.body;
    const hash = bcrypt.hashSync(password, 12);

    try{
        const userExists = await User.findOne({ email: email});
        if(userExists){
           return res.render('index', { message: "User already exists", showModal: 'signup' });
        }
        await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hash,
            role: role || 'guest',
        });
        res.redirect('/');
    }
    catch(error){
        console.log(" Error occured ", error);
        res.redirect('/');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const findUser = await User.findOne({ email: email });
        if (!findUser) {
            return res.render('index', { error: "User does not exist", showModal: 'login' });
        }
        if (!bcrypt.compareSync(password, findUser.password)) {
            return res.render('index', { error: "Wrong Password!", showModal: 'login' });
        }
        const token = generateToken(findUser);
        return res.cookie("token", token).redirect('/');
    } catch (error) {
        console.log(error);
        return res.render('index', { error: 'Invalid Credentials', showModal: 'login' });
    }
};

const logout = async(req, res) => {
    res.clearCookie('token').redirect('/');
}

const hotelOwnerProfile = async(req, res) => {
    res.render('hotelOwner');
}

module.exports = { registerUser, login, logout, hotelOwnerProfile };