const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

orderId: String,
customer: String,
email: String,
address: String,
date: String,
status: String,

items: [
{
name: String,
price: Number,
qty: Number,
image: String
}
]

})

module.exports = mongoose.model("Order", orderSchema)