const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    company: String,
    // Access will be priveledges. 1 is highest 3 is lowest
    access: {
        type: Number,
        min: 1,
        max: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: [4, "Minimum length of 4 characters"],
        maxLength: [20, "Maximum length of 20 characters"]
    }
});

userSchema.plugin(validator);

const User = mongoose.model("User", userSchema);

module.exports = User;