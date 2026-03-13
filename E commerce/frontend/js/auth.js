/* REGISTER */

function register(){

let name=document.getElementById("regName").value
let email=document.getElementById("regEmail").value
let password=document.getElementById("regPassword").value

if(name==="" || email==="" || password===""){
alert("Fill all fields")
return
}

let users=JSON.parse(localStorage.getItem("users")) || []

let exists=users.find(u=>u.email===email)

if(exists){
alert("User already exists")
return
}

users.push({name,email,password})

localStorage.setItem("users",JSON.stringify(users))

alert("Registration Successful")

window.location="login.html"

}



/* LOGIN */

function login(){

let email=document.getElementById("loginEmail").value
let password=document.getElementById("loginPassword").value

let users=JSON.parse(localStorage.getItem("users")) || []

let user=users.find(u=>u.email===email && u.password===password)

if(!user){

alert("Invalid Login")

return

}

localStorage.setItem("currentUser",JSON.stringify(user))

window.location="index.html"

}



/* CHECK LOGIN */

function checkAuth(){

let user=localStorage.getItem("currentUser")

if(!user){

window.location="login.html"

}

}



/* LOGOUT */

function logout(){

localStorage.removeItem("currentUser")

window.location="login.html"

}