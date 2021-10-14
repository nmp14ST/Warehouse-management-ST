const mongoose = require("mongoose");
require("dotenv").config();

const db = require("../models");

const addProductToWarehouse = async ({ name, price, space, description }, whID) => {
    try {
        await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Find warehouse and push product _id into array of products and increment size and numProducts
        const wh = await db.Warehouse.findOne({ _id: whID });

        if (!wh) throw { status: 404, message: "Warehouse not found" };

        // Check if adding product exceeds warehouse limit and throw error if it does
        // Could use validator on model, but we want to prevent product from being saved too so do it early here
        if (wh.size + parseInt(space) > wh.limit) {
            throw { status: 400, message: "Warehouse limit exceeded" };
        }
        // Create new product
        const newProduct = new db.Product({ name, price, space, description });
        await newProduct.save();

        wh.products.push(newProduct._id);
        wh.numProducts++;
        wh.size += parseInt(space);

        await wh.save();

        mongoose.connection.close();
        return newProduct;
    } catch (err) {
        mongoose.connection.close();
        throw err;
    }
}

module.exports = { addProductToWarehouse };