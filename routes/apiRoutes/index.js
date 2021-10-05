const router = require("express").Router();
const productRoutes = require("./products");
const warehouse = require("./warehouse");

router.use("/products", productRoutes);

module.exports = router;