const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});