const { login, register } = require("../../controllers/users");
const { isAuth, isManager } = require("../../utils");

const router = require("express").Router();

router.post("/login", async (req, res) => {
    try {
        const user = await login(req.body.email, req.body.password);

        res.status(200).json(user);
    } catch (err) {
        res.status(err.status ? err.status : 500).json(err);
        console.error(err);
    }
});

router.post("/register", isAuth, isManager, async (req, res) => {
    try {
        const user = await register(req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.body.company, req.body.access);

        if (user.id) {
            res.status(201).json(user);
        }
    } catch (err) {
        res.status(err.status ? err.status : 500).json(err);
        console.error(err);
    }
});

module.exports = router;