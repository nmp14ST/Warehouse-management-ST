const router = require("express").Router();
const { addProductToWarehouse, deleteProductFromWarehouse, updateProduct } = require("../../controllers/Products");

router.get("/", (req, res) => {
    try {
        res.status(200).json({ data: "Some data" });
    } catch (err) {
        console.error(err);
    }
});

// Create new product and add to warehouse
router.post("/:warehouseID", async (req, res) => {
    try {
        const whProduct = await addProductToWarehouse(req.body, req.params.warehouseID);

        res.status(200).json(whProduct);
    } catch (err) {
        res.status(err.status ?? 500).json(err);
        console.error(err);
    }
});

// Delete product and remove from warehouse
router.delete("/:warehouseID/:productID", async (req, res) => {
    try {

        const msg = await deleteProductFromWarehouse(req.params.warehouseID, req.params.productID);

        res.status(200).json(msg);
    } catch (err) {
        res.status(err.status ?? 500).json(err);
        console.error(err);
    }
});

// Update product
router.put("/:id", async (req, res) => {
    try {
        await updateProduct(req.body, req.params.id);

        res.status(200).json();
    } catch (err) {
        res.status(err.status ?? 500).json(err);
        console.error(err);
    }
});

module.exports = router;