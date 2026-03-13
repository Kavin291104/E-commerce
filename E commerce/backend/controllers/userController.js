const User = require("../models/user")
const bcrypt = require("bcryptjs")

exports.register = async(req,res)=>{

const {name,email,password} = req.body

const hashed = await bcrypt.hash(password,10)

const user = new User({
name,
email,
password:hashed
})

await user.save()

res.json(user)

}