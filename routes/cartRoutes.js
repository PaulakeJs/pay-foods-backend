const router = require("express").Router();
const Cart = require("../models/CartSchema");
const auth = require("../middleware/auth");

router.post("/add", auth, async (req, res) => {
  try {
    const ecart = await Cart.findOne({
      foodtitle: req.body.foodtitle,
      foodownerId: req.body.foodownerId,
    });
    if (ecart) {
      throw new Error("item already in cart");
    }
    const newcartitem = new Cart(req.body);
    await newcartitem.save();
    res.send({
      success: true,
      message: "Item added to cart",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/cart", auth, async (req, res) => {
  try {
    const result = await Cart.find({ foodownerId: req.body.userId });
    if (!result) {
      throw new Error("Empty");
    }
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "empty",
    });
  }
});

router.delete("/cart/delete/:id", auth, async (req, res) => {
  try {
    const cartitem = await Cart.findByIdAndDelete(req.params.id);
    if (!cartitem) {
      throw new Error("Invalid Cart Item");
    }
    res.status(200).send({
      success: true,
      message: "Item Removed From Cart",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
