const mongoose = require("mongoose");
const { Expense } = require("../models");

const addExpense = async (data) => {
  return await Expense.create(data);
};

const findExpenses = async (condition, limit, skip) => {
  return await Expense.find(condition).skip(skip).limit(limit);
};

const findAndUpdateExpense = async (condition, data) => {
  return await Expense.findOneAndUpdate(condition, data);
};

const findAndDeleteExpense = async (condition) => {
  return await Expense.findByIdAndDelete(condition);
};

const aggregateExpenseQuery = async (query) => {
  return await Expense.aggregate(query);
};

module.exports = {
  addExpense,
  findExpenses,
  findAndUpdateExpense,
  findAndUpdateExpense,
  findAndDeleteExpense,
  aggregateExpenseQuery,
};
