const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://developerpaulake:James112@cluster0.s6nsrq2.mongodb.net/payFoods?retryWrites=true&w=majority&appName=Cluster0");

const connection = mongoose.connection;

connection.on("connected", () => console.log("Connected"));
connection.on("error", () => console.log("error"));


module.exports = connection
