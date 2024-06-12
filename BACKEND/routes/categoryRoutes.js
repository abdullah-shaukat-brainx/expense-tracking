const express = require("express");
const router = express.Router();

const { categoryController } = require("../controllers");

router.use(express.urlencoded({ extended: false }));

router.get("/", categoryController.getCategories);
router.get("/get_all_categories", categoryController.getAllCategories);
router.post("/", categoryController.addCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
