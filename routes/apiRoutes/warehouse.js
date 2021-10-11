const router = require("express").Router();
const mongoose = require("mongoose");
const db = require("../../models");

router.get("/", async (req, res) => {
    try {
        await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        const warehouses = await db.Warehouse.find({});

        res.status(200).json(warehouses);
        mongoose.connection.close();
    } catch (err) {
        mongoose.connection.close();
        res.status(err.status ?? 500).json(err);
        console.error(err);
    }
});

module.exports = router;