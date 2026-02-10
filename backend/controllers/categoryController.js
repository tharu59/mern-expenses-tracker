const asyncHandler = require("express-async-handler");
const Category = require("../model/Category");

const categoryController = {
  // !add
  create: asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    if (!name) {
      throw new Error("Name is required for creating a category");
    }
    if (!type) {
      throw new Error("Type is required for creating a category");
    }
    // ?Convert the name to lowercase
    const normalizedName = name.toLowerCase();
    // ?Convert the type to lowercase
    const normalizedType = type.toLowerCase();

    // ? Check if the type is valid
    const validTypes = ["income", "expense"];
    if (!validTypes.includes(normalizedType)) {
      throw new Error(`Invalid category type: ${type}`);
    }

    // ! Check if category is exists on the user
    const categoryExists = await Category.findOne({
      name: normalizedName,
      user: req.user,
    });
    // ! check if category exists
    if (categoryExists) {
      throw new Error(
        `Category ${categoryExists.name} already exists in the database`,
      );
    }
    // !create a category
    const category = await Category.create({
      name: normalizedName,
      user: req.user,
      type: normalizedType,
    });
    res.status(201).json(category);
  }),
  // !lists
  lists: asyncHandler(async (req, res) => {
    const categories = await Category.find({
      user: req.user,
    });
    res.status(200).json(categories);
  }),
  // !Update
  update: asyncHandler(async (req, res) => {}),
  // !delete
  delete: asyncHandler(async (req, res) => {}),
};

module.exports = categoryController;
