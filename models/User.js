const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

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
    // Access will be priveledges. 1 is highest 4 is lowest
    access: {
        type: Number,
        min: 1,
        max: 4
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

userSchema.pre('save', async function (next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // Hash
    user.password = await bcrypt.hash(user.password, 10);
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;