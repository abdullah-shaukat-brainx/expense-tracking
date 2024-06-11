const express = require("express");
const router = express.Router();
const auth = require("../middlewares");

router.use("/users", require("./userRoutes"));
router.use("/expense", auth.auth, require("./expenseRoutes"));
router.use("/category", auth.auth, require("./categoryRoutes"));
router.use("/budget", auth.auth, require("./budgetRoutes"));

module.exports = router;

// GET host/api/version/users
// GET host/api/version/users/:id
// POST host/api/version/users
// PATCH host/api/version/users/:id
// DELETE // /// // /users/:id
