const mongoose = require('mongoose')

const deliverySchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    unitType:{
        type:String,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Types.ObjectId,
        required:true
    }
})

const Delivery = mongoose.model('Delivery Information' , deliverySchema)

module.exports = Delivery