const router = require("express").Router();
const { resolve } = require("path");

// Landing page
router.get("/", (req, res) => {
    try {
        res.status(200).sendFile(resolve("public", "views", "index.html"));
    } catch (err) {
        console.error(err);
    }
});

// login page
router.get("/login", (req, res) => {
    try {
        res.status(200).sendFile(resolve("public", "views", "login.html"));
    } catch (err) {
        console.error(err);
    }
});

// Interface for app
router.get("/interface", (req, res) => {
    try {
        res.status(200).sendFile(resolve("public", "views", "interface.html"));
    } catch (err) {
        console.error(err);
    }
});

// Add company form 
router.get("/addCompany", (req, res) => {
    try {
        res.status(200).sendFile(resolve("public", "views", "addCompany.html"));
    } catch (err) {
        console.error(err);
    }
});

// Any routes not found
router.get("*", (req, res) => {
    try {
        res.status(404).sendFile(resolve("public", "views", "404.html"));
    } catch (err) {
        console.error(err);
    }
})

module.exports = router;