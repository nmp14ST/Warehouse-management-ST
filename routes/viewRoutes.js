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

router.get("*", (req, res) => {
    try {
        res.status(404).sendFile(resolve("public", "views", "404.html"));
    } catch (err) {
        console.error(err);
    }
})

module.exports = router;