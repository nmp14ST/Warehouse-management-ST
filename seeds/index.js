const mongoose = require("mongoose");
const companySeeds = require("./companies.json");
const db = require("../models");
require("dotenv").config();

const seed = async () => {
    await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const business = new db.Business(companySeeds);

    await business.save();
    console.log("\n\n Business seeds run \n\n");

    mongoose.connection.close();
}

seed();