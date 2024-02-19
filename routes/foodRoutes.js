const router = require("express").Router();
const cloudinary = require("../config/cloudinary.js");
const multer = require("multer");
const Food = require("../models/FoodSchema");
const auth = require("../middleware/auth");

router.post("/new", auth, async (req, res) => {
  try {
    const newfood = await new Food(req.body);
    await newfood.save();
    res.send({
      success: true,
      message: "food added success",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-all-recipes", auth, async (req, res) => {
  try {
    const recipes = await Food.find();
    if (!recipes) {
      throw new Error("Recipes Not Found");
    }
    res.send({
      success: true,
      data: recipes,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-recipe-by-id/:id", auth, async (req, res) => {
  try {
    const recipe = await Food.findById(req.params.id);
    if (!recipe) {
      throw new Error("Recipe Not Found");
    }
    res.send({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/update-recipe/:id", auth, async (req, res) => {
  try {
    const recipe = await Food.findByIdAndUpdate(req.params.id, req.body);
    if (!recipe) {
      throw new Error("Invalid Recipe");
    }
    res.send({
      success: true,
      message: "Updated SuccessFully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/delete-recipe/:id", auth, async (req, res) => {
  try {
    const recipe = await Food.findByIdAndDelete(req.params.id);
    if (!recipe) {
      throw new Error(
        "Unable To Delete This Product At This Time Try Again Later"
      );
    }
    res.send({
      success: true,
      message: "Deleted SuccessFully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname); // Fix typo here: file.originalname
  },
});

router.post(
  "/add-food-image",
  auth,
  multer({ storage: storage }).single("file"),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "payFoods",
      });
      const foodId = req.body.foodId;
      await Food.findByIdAndUpdate(foodId, {
        $push: { images: result.secure_url },
      });
      res.send({
        success: true,
        message: "Images added successfully",
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

router.get("/get-recipe-byId/:id", auth, async (req, res) => {
  try {
    const recipe = await Food.findById(req.params.id);
    if (!recipe) {
      // Using 404 status code for "Not Found"
      return res.status(404).send({
        success: false,
        message: "Recipe not found",
      });
    }

    // Using 200 status code for successful response
    res.status(200).send({
      success: true,
      data: recipe,
    });
  } catch (error) {
    // Using 500 status code for internal server error
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
