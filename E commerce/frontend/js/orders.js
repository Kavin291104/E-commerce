async function loadOrders() {

let container = document.getElementById("ordersContainer")

try {

let user = JSON.parse(localStorage.getItem("currentUser"))

if (!user) {
container.innerHTML = "<p style='text-align:center'>User not logged in</p>"
return
}

let res = await fetch("http://localhost:5000/api/orders/" + user.email)

let orders = await res.json()

if (orders.length === 0) {

container.innerHTML = "<p style='text-align:center'>No orders yet</p>"

return

}

container.innerHTML = ""

orders.forEach(order => {

let productsHTML = ""

order.items.forEach(item => {

productsHTML += `
<div class="product">

<img src="${item.image || 'https://via.placeholder.com/60'}">

<div>
<div class="product-name">${item.name}</div>
<div class="product-price">₹${item.price} × ${item.qty}</div>
</div>

</div>
`

})

let card = `
<div class="order-card">

<div class="order-top">

<div>
<div class="order-id">Order ID: ${order.orderId}</div>
<div class="order-date">${order.date}</div>
</div>

<div class="status ${order.status.toLowerCase()}">
${order.status}
</div>

</div>

<div class="products">
${productsHTML}
</div>

${
order.status !== "Cancelled"
? `<button class="cancel-btn" onclick="cancelOrder('${order._id}')">Cancel Order</button>`
: `<p class="cancelled-text">Order Cancelled</p>`
}

</div>
`

container.innerHTML += card

})

} catch (err) {

container.innerHTML = "Error loading orders"

}

}

loadOrders()


async function cancelOrder(orderId){

if(!confirm("Are you sure you want to cancel this order?")){
return
}

try{

await fetch(`http://localhost:5000/api/orders/cancel/${orderId}`,{
method:"DELETE"
})

alert("Order Cancelled")

loadOrders()

}catch(err){

console.log(err)

}

}