const router = require("express").Router();
const viewRoutes = require("./viewRoutes");
const apiRoutes = require("./apiRoutes");

router.use("/", viewRoutes);
router.use("/api", apiRoutes);

module.exports = router;