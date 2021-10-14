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
    limit: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: function (v) {
                return v <= this.limit;
            },
            message: () => `Warehouse limit exceeded`
        },
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;