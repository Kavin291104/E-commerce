require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

const productRoutes = require("./routes/productRoutes")
const orderRoutes = require("./routes/orderRoutes")

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
res.send("Ecommerce Backend Running")
})

app.use("/api/products",productRoutes)
app.use("/api/orders",orderRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
console.log(`Server running at http://localhost:${PORT}`)
})
