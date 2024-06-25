const express = require("express");
const router = express.Router();
const auth = require("../middlewares");

router.use("/users", require("./userRoutes"));
router.use("/expense", auth.auth, require("./expenseRoutes"));
router.use("/category", auth.auth, require("./categoryRoutes"));
router.use("/budget", auth.auth, require("./budgetRoutes"));
router.use("/dashboard", auth.auth, require("./dashboardRoutes"));

module.exports = router;