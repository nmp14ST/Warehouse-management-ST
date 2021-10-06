const login = require("../../controllers/users");

const router = require("express").Router();

router.post("/login", async (req, res) => {
    try {
        const { user } = await login(req.body.email, req.body.password);
        console.log(user);

        res.status(200).json({ user });
    } catch (err) {
        res.status(err.status ? err.status : 500).json(err);
        console.error(err);
    }
});

module.exports = router;