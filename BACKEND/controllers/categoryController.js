const { categoryServices } = require("../services");
const mongoose = require("mongoose");

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(422).send({ error: "Name field cant be empty!" });

    const category = await categoryServices.findCategory({
      user_id: new mongoose.Types.ObjectId(req.userId),
      name: name.toLowerCase(),
    });
    if (category)
      return res
        .status(400)
        .send({ error: "Category with entered name already exist!" });

    const savedCategory = await categoryServices.addCategory({
      name: name,
      user_id: new mongoose.Types.ObjectId(req.userId),
    });

    if (!savedCategory) {
      return res.status(441).send({ error: "Category not Created" });
    }

    return res.status(200).json({
      message: "Category added successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Unable to create Category." });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const result = await categoryServices.findCategories({
      user_id: new mongoose.Types.ObjectId(req.userId),
      is_deleted: false,
    });

    return res.status(200).json({
      data: {
        Categories: result,
      },
      message: `All categories retrieved successfully`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Unable to retrieve Categories." });
  }
};

const getCategories = async (req, res) => {
  //Move large query to Services
  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 5;
  const skip = (page - 1) * limit;
  try {
    const result = await categoryServices.aggregateCategoryQuery([
      {
        $match: {
          is_deleted: false,
          user_id: new mongoose.Types.ObjectId(req.userId),
          ...(req?.query?.searchQuery && {
            name: { $regex: req.query.searchQuery, $options: "i" },
          }),
        },
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          paginatedResults: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
      {
        $project: {
          totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
          paginatedResults: 1, //sort order
        },
      },
    ]);

    return res.status(200).json({
      data: {
        Categories: result[0]?.paginatedResults || [],
        count: result[0]?.totalCount || 0,
      },
      message: `Categories for ${req.userEmail} retrieved successfully`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Unable to retrieve Categories." });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryID = req.params.id;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryID)) {
      return res.status(400).send({ error: "Invalid category ID." });
    }

    if (!categoryID || !name)
      return res.status(500).send({ error: "Category information missing." });

    const category = await categoryServices.findCategory({
      user_id: new mongoose.Types.ObjectId(req.userId),
      name: name.toLowerCase(),
    });
    if (category)
      return res
        .status(400)
        .send({ error: "Category with entered name already exisit!" });

    const updatedCategory = await categoryServices.findAndUpdateCategory(
      { _id: new mongoose.Types.ObjectId(categoryID) },
      { name: name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).send({ error: "Wrong category Id." });
    }

    res.status(200).json({
      message: `Category updated successfully!`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Unable to update Category." });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = new mongoose.Types.ObjectId(req.params.id);
    if (!categoryId)
      return res
        .status(400)
        .send({ error: "category id is missing from request parameters." });

    const deletedCategory = await categoryServices.findAndDeleteCategory({
      _id: categoryId,
    });

    if (!deletedCategory)
      return res
        .status(404)
        .send({ error: "Category with the entered id does not exist." });

    return res.status(200).json({
      message: `Category deleted successfully!`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Error occoured at the server." });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  getCategories,
  updateCategory,
  deleteCategory,
};
