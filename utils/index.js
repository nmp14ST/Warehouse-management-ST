const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = user => {
    return jwt.sign({
        id: user._id,
        email: user.email,
        company: user.company,
        access: user.access
    }, process.env.JWT_SECRET, {
        expiresIn: "10d"
    });
}

const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length); // Bearer XXXXX
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.status(401).json({ message: "Invalid token" });
            } else {
                req.user = decode;
                next();
            }
        });
    } else {
        res.status(401).json({ message: "No Token" });
    }
}

// Top lvl auth
const isManager = (req, res, next) => {
    console.log(req.user);
    if (req.user && req.user.access === 1) {
        next();
    } else {
        res.status(401).json({ message: "Insufficient access rights" });
    }
}

// Lvl 2 auth (2nd highest of 4)
const isAdmin = (req, res, next) => {
    if (req.user && req.user.access <= 2) {
        next();
    } else {
        res.status(401).json({ message: "Insufficient access rights" });
    }
}

// Lvl 3 auth (3rd highest of 4)
const isUpdater = (req, res, next) => {
    if (req.user && req.user.access <= 3) {
        next();
    } else {
        res.status(401).json({ message: "Insufficient access rights" });
    }
}

module.exports = { generateToken, isAuth, isManager, isAdmin, isUpdater };