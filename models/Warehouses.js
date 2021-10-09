const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    space: Number,
    description: String
});

const warehouseSchema = mongoose.Schema({
    name: String,
    limit: Number,
    companyID: {
        type: String,
        required: true
    },
    numProducts: {
        type: Number,
        default: 0
    },
    size: {
        type: Number,
        required: true,
        default: 0
    },
    products: [productSchema]
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;