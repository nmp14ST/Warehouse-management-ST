const router = require("express").Router();
const { resolve } = require("path");

router.get("/", (req, res) => {
    try {
        res.status(200).sendFile(resolve("public", "views", "index.html"));
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;