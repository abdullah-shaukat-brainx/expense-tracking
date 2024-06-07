const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.set("timestamps", { createdAt: true, updatedAt: true });

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
