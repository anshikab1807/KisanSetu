const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/CategoryModel"); // adjust path if needed
const connectDB = require("./db/connection");

dotenv.config();
connectDB();

const categories = [
  { name: "Vegetables" },
  { name: "Fruits" },
  { name: "Grains" },
  { name: "Dairy" },
  { name: "Spices" }
];

const seedCategories = async () => {
  try {
    await Category.deleteMany(); // Remove existing categories
    await Category.insertMany(categories);
    console.log("Categories seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedCategories();
