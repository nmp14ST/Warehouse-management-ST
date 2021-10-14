const mongoose = require("mongoose");
const companySeeds = require("./companies.json");
const warehouseSeeds = require("./warehouses.json");
const db = require("../models");
require("dotenv").config();

const seed = async () => {
    await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    await db.Business.remove({});
    const business = new db.Business(companySeeds);

    await business.save();
    console.log("\n\n Business seeds run \n\n");

    await db.Warehouse.remove({});
    const warehouses = await db.Warehouse.insertMany(warehouseSeeds)
        .then(() => console.log("\n\n warehouse seeds run"))
        .catch((err) => console.log("\n" + err + "\n"));

    mongoose.connection.close();
}

seed();