const mongoose = require("mongoose");
const { Category } = require("../models");

const addCategory = async (data) => {
  return await Category.create(data);
};

const findCategory = async (condition) => {
  return await Category.findOne(condition);
};

const findAllCategory = async (condition) => {
  return await Category.find(condition);
};
const findCategories = async (condition, limit, skip) => {
  return await Category.find(condition).skip(skip).limit(limit);
};

const findAndUpdateCategory = async (condition, data) => {
  return await Category.findOneAndUpdate(condition, data);
};

const findAndDeleteCategory = async (condition) => {
  // const category = await Category.findById(condition);
  // if (category) {
  //   await category.remove();
  // }
  // return category;
  return await Category.findOneAndUpdate(condition, { is_deleted: true });
};

const aggregateCategoryQuery = async (query) => {
  return await Category.aggregate(query);
};

module.exports = {
  addCategory,
  findCategory,
  findCategories,
  findAndUpdateCategory,
  findAndUpdateCategory,
  findAndDeleteCategory,
  aggregateCategoryQuery,
};
