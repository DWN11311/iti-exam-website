import { User } from "./data/user.js";
const user = User.find(localStorage["currentUser"]);

// Load nav and hero names
if (document.querySelector("#nav-name")) {
    document.querySelector("#nav-name").innerText = user.firstName;
}

if (document.querySelector("#hero-name")) {
    document.querySelector("#hero-name").innerText = user.firstName;
}

// Logout button
document.querySelector("#logout-btn").addEventListener("click", function () {
    localStorage["currentUser"] = "";
    window.location = "login.html";
});
