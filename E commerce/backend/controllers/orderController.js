const Order = require("../models/order")

exports.createOrder = async(req,res)=>{

const order = new Order(req.body)

await order.save()

res.json(order)

}

exports.getOrders = async(req,res)=>{

const orders = await Order.find()

res.json(orders)

}