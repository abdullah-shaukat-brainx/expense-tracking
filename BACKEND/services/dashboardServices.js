const mongoose = require("mongoose");
const { Expense, Budget } = require("../models");

const getAnalytics = async (id, filterDate) => {
  try {
    const startOfMonth = new Date(
      Date.UTC(filterDate.getFullYear(), filterDate.getMonth(), 1)
    );
    const endOfMonth = new Date(
      Date.UTC(filterDate.getFullYear(), filterDate.getMonth() + 1, 0)
    );

    const aggregateQuery = [
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(id),
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$category_id",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 0,
          categoryName: "$category.name",
          totalAmount: 1,
        },
      },
    ];

    return await Expense.aggregate(aggregateQuery);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

const getCurrentMonthStatus = async (id, filterDate) => {
  try {
    const startOfMonth = new Date(
      Date.UTC(filterDate.getFullYear(), filterDate.getMonth(), 1)
    );
    const endOfMonth = new Date(
      Date.UTC(filterDate.getFullYear(), filterDate.getMonth() + 1, 0)
    );

    const monthlyBudget = await Budget.findOne({
      user_id: new mongoose.Types.ObjectId(id),
      month: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const monthlyExpenses = await Expense.find({
      user_id: new mongoose.Types.ObjectId(id),
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const budgetAmount = monthlyBudget?.amount || 0;
    let expenseAmount = 0;

    if (monthlyExpenses && monthlyExpenses.length > 0) {
      expenseAmount = monthlyExpenses.reduce((accumulator, expense) => {
        return accumulator + expense.amount;
      }, 0);
    }

    const remainingAmount = budgetAmount - expenseAmount;

    return { budgetAmount, remainingAmount };
  } catch (error) {
    console.error("Error fetching current month status:", error);
    throw error;
  }
};

async function getCumulativeExpenses(id, filterDate) {
  try {
    const startOfMonth = new Date(
      Date.UTC(filterDate.getFullYear(), filterDate.getMonth(), 1)
    );
    const endOfMonth = new Date(
      Date.UTC(filterDate.getFullYear(), filterDate.getMonth() + 1, 0)
    );

    // Calculate the number of days in the month
    const daysInMonth = endOfMonth.getUTCDate();

    const expenses = await Expense.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(id),
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$date" },
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          totalAmount: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
      {
        $group: {
          _id: null,
          dailyExpenses: {
            $push: {
              date: "$date",
              totalAmount: "$totalAmount",
            },
          },
        },
      },
      {
        $addFields: {
          allDates: Array.from({ length: daysInMonth }, (_, i) => ({
            date: new Date(Date.UTC(filterDate.getFullYear(), filterDate.getMonth(), i + 1)),
            totalAmount: 0,
          })),
        },
      },
      {
        $project: {
          dailyExpenses: {
            $concatArrays: ["$dailyExpenses", "$allDates"],
          },
        },
      },
      {
        $unwind: "$dailyExpenses",
      },
      {
        $group: {
          _id: "$dailyExpenses.date",
          totalAmount: { $sum: "$dailyExpenses.totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $setWindowFields: {
          sortBy: { _id: 1 },
          output: {
            cumulativeAmount: {
              $sum: "$totalAmount",
              window: {
                documents: ["unbounded", "current"],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          cumulativeAmount: 1,
        },
      },
    ]);

    return expenses;
  } catch (error) {
    console.error("Error retrieving cumulative expenses:", error);
    throw error;
  }
}

module.exports = {
  getAnalytics,
  getCurrentMonthStatus,
  getCumulativeExpenses,
};
