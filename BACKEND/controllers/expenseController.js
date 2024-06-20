const { expenseServices, budgetServices } = require("../services");
const mongoose = require("mongoose");

const addExpense = async (req, res) => {
  try {
    const { date, amount, category_id, description } = req.body;
    if (!date || !amount || !category_id || !description)
      return res.status(422).send({ error: "A field can't be empty!" });
    if (Math.floor(amount) <= 0)
      return res
        .status(422)
        .send({ error: "Amount should be a positive number!" });

    // Budget's logic start
    const [year, month] = date.split("-").map(Number);
    const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const endOfMonth = new Date(Date.UTC(year, month, 0));
    const budgetForMonth = await budgetServices.findBudget({
      month: { $gte: startOfMonth, $lte: endOfMonth },
    });

    if (!budgetForMonth) {
      return res
        .status(441)
        .send({ error: "Budget for entered month does not exist" });
    }
    // Budget Logic Ends here

    const savedExpense = await expenseServices.addExpense({
      date: new Date(date).toISOString(), // Convert date to UTC format
      amount: amount,
      user_id: req.userId,
      category_id: category_id,
      description: description,
    });

    if (!savedExpense) {
      return res.status(441).send({ error: "Expense not Created" });
    }

    return res.status(200).json({
      message: "Expense added successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Unable to create Expense." });
  }
};

const getExpenses = async (req, res) => {
  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 5;
  const skip = (page - 1) * limit;
  const startDate = req?.query?.startDate;
  const endDate = req?.query?.endDate;

  let matchCriteria = {
    user_id: new mongoose.Types.ObjectId(req.userId),
  };

  if (req?.query?.category_id) {
    matchCriteria.category_id = new mongoose.Types.ObjectId(
      req.query.category_id
    );
  }

  if (startDate && endDate) {
    matchCriteria.date = {
      $gte: new Date(new Date(startDate).toISOString()),
      $lte: new Date(new Date(endDate).toISOString()),
    };
  } else if (startDate) {
    matchCriteria.date = {
      $gte: new Date(new Date(startDate).toISOString()),
    };
  } else if (endDate) {
    matchCriteria.date = {
      $lte: new Date(new Date(endDate).toISOString()),
    };
  }

  try {
    const result = await expenseServices.aggregateExpenseQuery([
      {
        $match: matchCriteria,
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          paginatedResults: [
            { $sort: { date: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
      {
        $project: {
          totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
          paginatedResults: 1,
        },
      },
    ]);

    return res.status(200).json({
      data: {
        expenses: result[0]?.paginatedResults || [],
        count: result[0]?.totalCount || 0,
      },
      message: `Expenses for ${req.userEmail} retrieved successfully`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Unable to retrieve Expenses." });
  }
};

const getSingleExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).send({ error: "Invalid expense ID." });
    }

    const expense = await expenseServices.findOneExpense({ _id: expenseId });

    if (!expense) {
      return res.status(404).send({ error: "Expense not found." });
    }

    return res.status(200).json({
      data: expense,
      message: `Expense details retrieved successfully`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Unable to retrieve Expense." });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expenseID = req.params.id;
    const { date, amount, category_id, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(expenseID)) {
      return res.status(400).send({ error: "Invalid expense ID." });
    }

    if (!expenseID || !date || !amount || !category_id || !description)
      return res.status(500).send({ error: "Expense information missing." });

    const updatedExpense = await expenseServices.findAndUpdateExpense(
      { _id: new mongoose.Types.ObjectId(expenseID) },
      {
        date: new Date(date).toISOString(), // Convert date to UTC format
        amount: amount,
        category_id: category_id,
        description: description,
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).send({ error: "Wrong expense Id." });
    }

    res.status(200).json({
      message: `Expense updated successfully!`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Unable to update Expense." });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expenseId = new mongoose.Types.ObjectId(req.params.id);
    if (!expenseId)
      return res
        .status(400)
        .send({ error: "Expense id is missing from request parameters." });

    const deletedExpense = await expenseServices.findAndDeleteExpense({
      _id: expenseId,
    });

    if (!deletedExpense)
      return res
        .status(404)
        .send({ error: "Expense with the entered id does not exist." });

    return res.status(200).json({
      message: `Expense deleted successfully!`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Error occurred at the server." });
  }
};

module.exports = {
  addExpense,
  getSingleExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
