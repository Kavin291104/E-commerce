let cart = JSON.parse(localStorage.getItem("cart")) || []

let allProducts = []



/* LOAD PRODUCTS */

async function loadProducts(){

const res = await fetch("http://localhost:5000/api/products")

allProducts = await res.json()

displayProducts(allProducts)

}



/* DISPLAY PRODUCTS */

function displayProducts(products){

const container = document.getElementById("productsContainer")

container.innerHTML=""

products.forEach(product=>{

const div=document.createElement("div")

div.className="product"

div.innerHTML=`

<img src="${product.image}">

<h3>${product.name}</h3>

<p class="price">₹${product.price}</p>

<button onclick="addToCart('${product.name}',${product.price},'${product.image}')">
Add to Cart
</button>

<button onclick="showDetails(
'${product.name}',
${product.price},
'${product.image}',
'${product.description}',
'${product.category}',
${product.rating || 4.5},
${product.stock || 10}
)">
View
</button>

`

container.appendChild(div)

})

}



/* ADD TO CART */

function addToCart(name,price,image){

let existing=cart.find(item=>item.name===name)

if(existing){
existing.qty++
}else{
cart.push({name,price,image,qty:1})
}

saveCart()
updateCartCount()
loadCart()

}



function saveCart(){
localStorage.setItem("cart",JSON.stringify(cart))
}



/* CART COUNT */

function updateCartCount(){

let count=0

cart.forEach(item=>count+=item.qty)

document.getElementById("cartCount").innerText=count

}



/* LOAD CART */

function loadCart(){

const cartItems=document.getElementById("cartItems")
const total=document.getElementById("total")

cartItems.innerHTML=""

let sum=0

cart.forEach((item,index)=>{

const li=document.createElement("li")

li.innerHTML=`

<img src="${item.image}" class="cart-img">

<div>

<p>${item.name}</p>
<p>₹${item.price}</p>

<div class="qty-controls">

<button onclick="decreaseQty(${index})">−</button>

<span>${item.qty}</span>

<button onclick="increaseQty(${index})">+</button>

</div>

</div>

`

cartItems.appendChild(li)

sum+=item.price*item.qty

})

total.innerText=sum

}



/* QUANTITY */

function increaseQty(index){

cart[index].qty++

saveCart()
updateCartCount()
loadCart()

}



function decreaseQty(index){

cart[index].qty--

if(cart[index].qty<=0){
cart.splice(index,1)
}

saveCart()
updateCartCount()
loadCart()

}



/* CART DRAWER */

function toggleCart(){

document.getElementById("cartDrawer").classList.toggle("open")
document.getElementById("overlay").classList.toggle("show")

}



/* CATEGORY FILTER */

function filterCategory(category){

if(category==="all"){
displayProducts(allProducts)
return
}

let filtered=allProducts.filter(p=>p.category===category)

displayProducts(filtered)

}



/* SEARCH */

function liveSearch(){

let input=document.getElementById("searchInput").value.toLowerCase()

let filtered=allProducts.filter(p=>p.name.toLowerCase().includes(input))

displayProducts(filtered)

}



/* PRODUCT POPUP */

function showDetails(name,price,image,desc,category,rating,stock){

document.getElementById("productPopup").style.display="flex"

document.getElementById("popupImage").src=image

document.getElementById("popupTitle").innerText=name

document.getElementById("popupPrice").innerText="₹"+price

document.getElementById("popupDesc").innerText=desc

document.getElementById("popupCategory").innerText="Category: "+category

document.getElementById("popupRating").innerText="Rating: ⭐ "+rating

document.getElementById("popupStock").innerText="Stock: "+stock+" available"

document.getElementById("popupCartBtn").onclick=function(){
addToCart(name,price,image)
closePopup()
}

}



/* OPEN CHECKOUT */

function openCheckout(){

if(cart.length===0){
alert("Cart is empty")
return
}

document.getElementById("cartDrawer").classList.remove("open")
document.getElementById("overlay").classList.remove("show")

document.getElementById("checkoutModal").style.display="flex"
document.getElementById("checkoutOverlay").style.display="block"

generateUPIQR()

const summary=document.getElementById("orderSummary")

summary.innerHTML=""

cart.forEach(item=>{

const li=document.createElement("li")

li.innerText=item.name+" x"+item.qty+" - ₹"+(item.price*item.qty)

summary.appendChild(li)

})

}



/* CLOSE CHECKOUT */

function closeCheckout(){

document.getElementById("checkoutModal").style.display="none"
document.getElementById("checkoutOverlay").style.display="none"

}



/* GENERATE UPI QR */

function generateUPIQR(){

let total=document.getElementById("total").innerText

let upi=`upi://pay?pa=kavin29114@oksbi&pn=Kavin%20M&am=${total}&cu=INR`

let qrURL="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data="+encodeURIComponent(upi)

document.getElementById("upiQR").src=qrURL

}



/* ORDER ID */

function generateOrderId(){
return "ORD"+Math.floor(Math.random()*1000000)
}



/* CONFIRM ORDER */

/* CONFIRM ORDER */

async function confirmOrder(){

let name = document.getElementById("custName").value
let address = document.getElementById("custAddress").value

if(name === "" || address === ""){
alert("Enter delivery details")
return
}

/* GET LOGGED IN USER */

let user = JSON.parse(localStorage.getItem("currentUser"))

if(!user){
alert("User not logged in")
return
}

closeCheckout()

document.getElementById("paymentLoading").style.display="block"

let orderId = generateOrderId()

/* PREPARE ORDER ITEMS WITH IMAGE */

let orderItems = cart.map(item => ({
name: item.name,
price: item.price,
qty: item.qty,
image: item.image || "images/default.png"
}))

/* ORDER DATA */

let orderData = {

orderId: orderId,
customer: name,
email: user.email,
address: address,
date: new Date().toLocaleString(),
status: "Processing",
items: orderItems

}

try{

await fetch("http://localhost:5000/api/orders",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(orderData)

})

}catch(err){
console.log("Order error:",err)
}

setTimeout(()=>{

document.getElementById("paymentLoading").style.display="none"

document.getElementById("orderIdText").innerText="Order ID: "+orderId

document.getElementById("orderSuccess").style.display="block"

/* CLEAR CART */

cart=[]
saveCart()
updateCartCount()
loadCart()

},1500)

}


/* CLOSE SUCCESS */

function closeSuccess(){
document.getElementById("orderSuccess").style.display="none"
}



/* LOGOUT */

function logout(){

localStorage.removeItem("currentUser")
window.location="login.html"

}



/* THEME SYSTEM */

function loadTheme(){

const theme=localStorage.getItem("theme")

if(theme==="dark"){
document.body.classList.add("dark-mode")
document.getElementById("themeSwitch").checked=true
}

}

function toggleTheme(){

document.body.classList.toggle("dark-mode")

if(document.body.classList.contains("dark-mode")){
localStorage.setItem("theme","dark")
}else{
localStorage.setItem("theme","light")
}

}

function closePopup(){

document.getElementById("productPopup").style.display = "none"

}



/* INIT */

document.addEventListener("DOMContentLoaded",()=>{

loadProducts()
updateCartCount()
loadCart()
loadTheme()

const themeSwitch=document.getElementById("themeSwitch")

if(themeSwitch){
themeSwitch.addEventListener("change",toggleTheme)
}

})

window.onclick = function(event){

let popup = document.getElementById("productPopup")

if(event.target === popup){
popup.style.display = "none"
}

}
