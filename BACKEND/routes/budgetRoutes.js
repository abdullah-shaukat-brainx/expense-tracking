const express = require("express");
const router = express.Router();

const { budgetController } = require("../controllers");

router.get("/", budgetController.getBudgets);
router.post("/", budgetController.addBudget);
router.put("/:id", budgetController.updateBudget);
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;
