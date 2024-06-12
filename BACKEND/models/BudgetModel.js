const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: Date,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
