const router = require("express").Router();
const productRoutes = require("./products");
const warehouseRoutes = require("./warehouse");
const userRoutes = require("./users");

router.use("/products", productRoutes);
router.use("/users", userRoutes);

module.exports = router;