const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.set("timestamps", { createdAt: true, updatedAt: true });

// categorySchema.pre('remove', async function (next) {
//   try {
//     await Expense.deleteMany({ category_id: this._id }); //Remove all related expenses
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
