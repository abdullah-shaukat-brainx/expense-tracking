const { budgetServices } = require("../services");
const mongoose = require("mongoose");

const addBudget = async (req, res) => {
  try {
    const { amount, month, year } = req.body;
    if (!month || !year || !amount)
      return res.status(422).send({ error: "A field cant be empty!" });
    if (Math.floor(amount) <= 0)
      return res
        .status(422)
        .send({ error: "Amount should be a positive number!" });

    const budgetDate = new Date(year, month);

    const findBudget = await budgetServices.findBudget({
      month: budgetDate,
    });

    if (findBudget)
      return res
        .status(441)
        .send({ error: "Budget already exist for entered month" });

    const savedBudget = await budgetServices.addBudget({
      amount: amount,
      month: budgetDate,
      user_id: req.userId,
    });

    if (!savedBudget) {
      return res.status(441).send({ error: "Budget not Created" });
    }

    return res.status(200).json({
      message: "Budget added successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Unable to create Budget." });
  }
};

const getBudgets = async (req, res) => {
  try {
    const result = await budgetServices.findAllBudgets({
      user_id: req.userId,
    });
    return res.status(200).json({
      data: {
        budgets: result || [],
      },
      message: `Budgets for ${req.userEmail} retrieved successfully`,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: "Unable to retrieve Budgets." });
  }
};

// const getBudgets = async (req, res) => {
//   const page = parseInt(req?.query?.page) || 1;
//   const limit = parseInt(req?.query?.limit) || 5;
//   const skip = (page - 1) * limit;

//   let matchCriteria = {
//     user_id: new mongoose.Types.ObjectId(req.userId),
//   };

//   try {
//     const result = await expenseServices.aggregateExpenseQuery([
//       {
//         $match: matchCriteria,
//       },
//       {
//         $facet: {
//           totalCount: [{ $count: "count" }],
//           paginatedResults: [
//             { $sort: { createdAt: -1 } },
//             { $skip: skip },
//             { $limit: limit },
//           ],
//         },
//       },
//       {
//         $project: {
//           totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
//           paginatedResults: 1,
//         },
//       },
//     ]);
//     return res.status(200).json({
//       data: {
//         budgets: result[0]?.paginatedResults || [],
//         count: result[0]?.totalCount || 0,
//       },
//       message: `Budgets for ${req.userEmail} retrieved successfully`,
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).send({ error: "Unable to retrieve Budgets." });
//   }
// };

const updateBudget = async (req, res) => {
  try {
    const budgetID = req.params.id;
    const { amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(budgetID)) {
      return res.status(400).send({ error: "Invalid budget ID." });
    }

    if (!budgetID || !amount)
      return res.status(500).send({ error: "Budget information missing." });

    // const budgetDate = new Date(year, month);

    const updatedBudget = await budgetServices.findAndUpdateBudget(
      { _id: new mongoose.Types.ObjectId(budgetID) },
      {
        // month: budgetDate,
        amount: amount,
      },
      { new: true }
    );

    if (!updatedBudget) {
      return res.status(404).send({ error: "Wrong budget Id." });
    }

    res.status(200).json({
      message: `Budget updated successfully!`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Unable to update Budget." });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budgetId = new mongoose.Types.ObjectId(req.params.id);
    if (!budgetId)
      return res
        .status(400)
        .send({ error: "Budget id is missing from request parameters." });

    const deletedBudget = await budgetServices.findAndDeleteBudget({
      _id: budgetId,
    });

    if (!deletedBudget)
      return res
        .status(404)
        .send({ error: "Budget with the entered id does not exist." });

    return res.status(200).json({
      message: `Budget deleted successfully!`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Error occoured at the server." });
  }
};

module.exports = {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};
