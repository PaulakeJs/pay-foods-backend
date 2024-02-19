const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    foodtitle: {
      type: String,
      required: true,
    },
    foodprice: {
      type: Number,
      required: true,
    },
    foodquantity: {
      type: Number,
      required: true,
      default: 1,
    },
    foodownerId: {
      type: String,
      required: true,
    },
    foodimage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
