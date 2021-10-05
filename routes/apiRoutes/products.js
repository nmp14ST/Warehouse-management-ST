const router = require("express").Router();

router.get("/", (req, res) => {
    try {
        res.status(200).json({ data: "Some data" });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;