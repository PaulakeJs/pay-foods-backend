const router = require("express").Router();
const auth = require("../middleware/auth");
const Order = require("../models/OrderSchema");

router.post('/new', auth, async (req,res) => {
    try{
        const newOrder = new Order(req.body)
        await newOrder.save()
        res.send({
            success:true,
            message:"Your Order Has Been placed",
            data:newOrder
        })
    }
    catch(error){
        res.send({
            success:false,
            message:error.message
        })
    }
})
