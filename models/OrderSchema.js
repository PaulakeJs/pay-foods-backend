const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  contact: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Order = mongoose.model("Orders", orderSchema);

module.exports = Order;
