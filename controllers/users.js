const mongoose = require("mongoose");
require("dotenv").config();
const { generateToken } = require("../utils");
const db = require("../models");

const login = async (email, password) => {
    try {
        await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        const user = await db.User.findOne({ email });

        if (!user) throw { status: 401, message: "User does not exist" };

        const isValidPassword = user.comparePassword(password);

        if (!isValidPassword) throw { status: 401, message: "Invalid email and password" };

        mongoose.connection.close();
        return {
            id: user._id,
            accessLevel: user.access,
            token: generateToken(user)
        };
    } catch (err) {
        mongoose.connection.close();
        throw err;
    }
}

const register = async (firstName, lastName, email, password, company, access) => {
    try {
        await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        const user = new db.User({ firstName, lastName, company, access, email, password });

        await user.save();

        mongoose.connection.close();
        return {
            id: user._id,
            accessLevel: user.access,
            token: generateToken(user)
        };
    } catch (err) {
        mongoose.connection.close();
        throw err;
    }
}

module.exports = { login, register };