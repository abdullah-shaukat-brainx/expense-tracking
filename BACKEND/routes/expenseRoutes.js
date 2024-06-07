const express = require("express");
const router = express.Router();

const { expenseController } = require("../controllers");

router.use(express.urlencoded({ extended: false }));

// router.get("/", expenseController.getExpense);
// router.post("/", expenseController.createExpense);
// router.put("/:id",expenseController.updateExpense);
// router.delete("/:id", expenseController.deleteExpense);

module.exports = router;