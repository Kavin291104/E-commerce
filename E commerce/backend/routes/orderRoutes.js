const express = require("express")
const router = express.Router()

const Order = require("../models/order")

// CREATE ORDER
router.post("/", async (req, res) => {

try {

const order = new Order(req.body)

await order.save()

res.json(order)

} catch (err) {

console.log(err)
res.status(500).json({ message: "Error saving order" })

}

})

// GET ALL ORDERS
router.get("/:email", async (req,res)=>{

const orders = await Order.find({email:req.params.email}).sort({_id:-1})

res.json(orders)

})
/* CANCEL ORDER */

router.delete("/cancel/:id", async (req,res)=>{

try{

await Order.findByIdAndDelete(req.params.id)

res.json({message:"Order Deleted"})

}catch(err){

res.status(500).json({error:"Error deleting order"})

}

})
module.exports = router