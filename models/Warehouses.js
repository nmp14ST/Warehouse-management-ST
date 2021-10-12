const mongoose = require("mongoose");

const warehouseSchema = mongoose.Schema({
    name: String,
    company_name: {
        type: String,
        required: true
    },
    numProducts: {
        type: Number,
        default: 0
    },
    limit: Number,
    size: {
        type: Number,
        required: true,
        default: 0
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;