const mongoose = require("mongoose");
require("dotenv").config();

const db = require("../models");

// Gets warehuse, checks if product can fit, creates product, adds product to wh, and increments warehouse size and numProducts
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

        // Add product to warehouse product array
        wh.products.push(newProduct._id);
        // Inc number of products
        wh.numProducts++;
        // Increase capacity of warehouse
        wh.size += parseInt(space);

        await wh.save();

        mongoose.connection.close();
        return newProduct;
    } catch (err) {
        mongoose.connection.close();
        throw err;
    }
}

// Find wh and pull product out, decrement size and numProducts, and delete product
const deleteProductFromWarehouse = async (whID, pID) => {
    try {
        await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Find, delete and return product
        const deletedProduct = await db.Product.findOneAndDelete({ _id: pID });

        // If product couldnt be found, throw 404
        if (!deletedProduct) throw { stauts: 404, message: "Could not find product" }

        // Find wh and remove the deleted products ID from products array and decrement the numProducts and size
        const wh = await db.Warehouse.findOneAndUpdate(
            {
                _id: whID
            }, {
            $pull: { products: pID }, $inc: { numProducts: -1, size: -deletedProduct.space }
        });

        // No warehouse found throw 404
        if (!wh) throw { status: 404, message: "Warehouse not found" };

        mongoose.connection.close();
        return deletedProduct;
    } catch (err) {
        mongoose.connection.close();
        throw err;
    }
}

module.exports = { addProductToWarehouse, deleteProductFromWarehouse };