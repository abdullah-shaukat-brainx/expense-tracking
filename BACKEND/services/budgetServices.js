const mongoose = require("mongoose");
const { Budget } = require("../models");

const addBudget = async (data) => {
  return await Budget.create(data);
};

const findAllBudgets = async (condition) => {
  return await Budget.find(condition);
};
const findBudget = async (condition) => {
  return await Budget.findOne(condition);
};
const findAndUpdateBudget = async (condition, data) => {
  return await Budget.findOneAndUpdate(condition, data);
};

const findAndDeleteBudget = async (condition) => {
  const budget = await Budget.findByIdAndDelete(condition);
  return budget;
};

const aggregateBudgetQuery = async (query) => {
  return await Budget.aggregate(query);
};

module.exports = {
  addBudget,
  findBudget,
  findAllBudgets,
  findAndUpdateBudget,
  findAndDeleteBudget,
  aggregateBudgetQuery,
};
