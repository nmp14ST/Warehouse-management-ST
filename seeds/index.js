const mongoose = require("mongoose");
const companySeeds = require("./companies.json");
const db = require("../models");

const seed = async () => {
    await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    mongoose.connection.close();
}

seed();