const mongoose = require("mongoose");
require("dotenv").config();

const db = require("../models");

const AddBusinessToTree = async (body) => {
    try {
        await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        let { name, founded, parent } = body;

        // Check if parent is url encoded due to query string
        if (parent.includes("%")) {
            parent = decodeURIComponent(parent);
            console.log(parent);
        }

        // Get parent business
        const business = await db.Business.find({ name: "SkillStorm" });
        const newBusiness = new db.Business({ name, founded });
        // Businesses are nested objects that form a heirarchy.
        // Need to recursively find the name of company we wish to add new company to

        let found = false;
        const findParent = (bs) => {
            if (bs === true) return true;
            // For each business in array
            // Loop over properties to find company name and see if it matches.
            // If property is "children" and it is not empty, call this function for the array
            // If name matches, push new business to children array and return
            for (const company of bs) {
                for (const prop in company) {
                    if (prop === "name") {

                        if (company[prop] === parent) {
                            company["children"].push(newBusiness);
                            found = true;
                            return true;
                        }

                    } else if (prop === "children" && company[prop].length > 0) {
                        findParent(company[prop]);
                    }
                }
            }
        }

        findParent(business);
        console.log(found);

        if (!found) throw { status: 400, message: "Failed to append" }

        await business[0].save();

        mongoose.connection.close();
    } catch (err) {
        mongoose.connection.close();
        throw err;
    }
}

module.exports = { AddBusinessToTree }