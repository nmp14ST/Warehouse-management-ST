const router = require("express").Router();
const productRoutes = require("./products");
const warehouseRoutes = require("./warehouse");
const userRoutes = require("./users");
const businessRoutes = require("./businesses");

router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/businesses", businessRoutes);
router.use("/warehouses", warehouseRoutes);

module.exports = router;