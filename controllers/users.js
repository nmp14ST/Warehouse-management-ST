const mongoose = require("mongoose");
require("dotenv").config();
const generateToken = require("../utils");
const db = require("../models");

const login = async (email, password) => {
    mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const user = await db.User.findOne({ email });

    if (!user) throw { status: 401, message: "Username does not exist" };

    const isValidPassword = user.comparePassword(password);

    if (!isValidPassword) throw { status: 401, message: "Invalid email and password" };

    return {
        status: 200, user: {
            id: user._id,
            accessLevel: user.access,
            token: generateToken(user)
        }
    };
}

module.exports = login;