const router = require("express").Router();
const { addProductToWarehouse } = require("../../controllers/Products");

router.get("/", (req, res) => {
    try {
        res.status(200).json({ data: "Some data" });
    } catch (err) {
        console.error(err);
    }
});

router.post("/:warehouseID", async (req, res) => {
    try {
        const whProduct = await addProductToWarehouse(req.body, req.params.warehouseID);

        res.status(200).json(whProduct);
    } catch (err) {
        res.status(err.status ?? 500).json(err);
        console.error(err);
    }
});

module.exports = router;