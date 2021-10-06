const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = user => {
    return jwt.sign({
        id: user._id,
        email: user.email,
        company: user.company,
        accessLevel: user.access
    }, process.env.JWT_SECRET, {
        expiresIn: "10d"
    });
}

module.exports = { generateToken };