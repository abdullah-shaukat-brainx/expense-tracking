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

categorySchema.pre("save", async function (next) {
  try {
    this.name = this.name.toLowerCase();
    next();
  } catch (error) {
    next(error);
  }
});

categorySchema.pre("findOneAndUpdate", async function (next) {
  try {
    if (this._update.name) {
      this._update.name = this._update.name.toLowerCase();
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
