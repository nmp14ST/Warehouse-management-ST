const router = require("express").Router();
const mongoose = require("mongoose");
const { AddBusinessToTree } = require("../../controllers/businesses");
const db = require("../../models");
require("dotenv").config();

router.get("/", async (req, res) => {
    try {
        await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        const response = await db.Business.findOne();

        if (!response) {
            throw { status: 404, message: "Cannot find businesses" }
        }

        mongoose.connection.close();
        res.status(200).json(response);
    } catch (err) {
        mongoose.connection.close();
        res.status(err.status ? err.status : 500).json(err);
        console.error(err);
    }
});

router.post("/", async (req, res) => {
    try {
        await AddBusinessToTree(req.body);

        res.status(200).json("Success");
    } catch (err) {
        res.status(err.status ? err.status : 500).json(err);
        console.error(err);
    }
});

module.exports = router;