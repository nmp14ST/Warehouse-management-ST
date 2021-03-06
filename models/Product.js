const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    space: Number,
    description: String
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;