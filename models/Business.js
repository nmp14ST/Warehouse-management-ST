const mongoose = require("mongoose");

const businessSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    founded: Number,
    warehouses: {
        type: Number,
        required: true
    },
});

businessSchema.add({
    children: [businessSchema]
});

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;