const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Delivery = require("../models/DeliverySchema");

router.post("/new", auth, async (req, res) => {
  try {
    const findInfo = await Delivery.findOne({
      address: req.body.address,
      phone: req.body.phone,
      owner: req.body.owner,
    });
    if (findInfo) {
      throw new Error("You have Already Added This Before");
    }
    const result = new Delivery(req.body);
    await result.save();
    res.send({
      success: true,
      message: "Added Success",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get/:id", auth, async (req, res) => {
  try {
    const owner = new mongoose.Types.ObjectId(req.params.id);
    const result = await Delivery.find({ owner });
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
