const router = require("express").Router();
const mongoose = require("mongoose");
const db = require("../../models");
const { isAuth } = require("../../utils");

router.get("/", isAuth, async (req, res) => {
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

// Route to get all warehouses for specific company
router.get("/:name", isAuth, async (req, res) => {
    try {
        await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        const warehouse = await db.Warehouse.find({ company_name: req.params.name }, "_id name company_name numProducts limit size");

        if (!warehouse.length) {
            throw { status: 404, message: "Cannot find that warehouse" };
        }

        res.status(200).json(warehouse);
        mongoose.connection.close();
    } catch (err) {
        mongoose.connection.close();
        res.status(err.status ?? 500).json(err);
        console.error(err);
    }
});

// Find a single warehouse by id
router.get("/single/:id", isAuth, async (req, res) => {
    try {
        await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        const warehouse = await (await db.Warehouse.findOne({ _id: req.params.id })).populate("products");

        if (!warehouse) throw { status: 404, message: `Could not find the warehouse with the id ${req.params.id}` }

        res.status(200).json(warehouse);
        mongoose.connection.close();
    } catch (err) {
        mongoose.connection.close();
        res.status(err.status ?? 500).json(err);
        console.error(err);
    }
});

module.exports = router;