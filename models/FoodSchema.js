const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categories: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingridents: {
      type: String,
      required: true,
    },
    ninfo: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("recipes", foodSchema);

module.exports = Food;
