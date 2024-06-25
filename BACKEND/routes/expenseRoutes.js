const express = require("express");
const router = express.Router();

const { expenseController } = require("../controllers");

// router.use(express.urlencoded({ extended: false }));

router.get("/", expenseController.getExpenses);
router.post("/", expenseController.addExpense);
router.put("/:id",expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);
router.get("/:id", expenseController.getSingleExpense);

module.exports = router;