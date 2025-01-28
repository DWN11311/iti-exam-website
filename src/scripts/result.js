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

console.log(user);

const queryString = document.location.search;
const urlParams = new URLSearchParams(queryString);
let date = new Date();
var currentDate = date.toLocaleDateString("en-GB");
document.getElementById("date").innerText = currentDate;

function numbersAnimation(number, targetElemnt, delay, suffix = "") {
    let count = 0;
    const interval = setInterval(() => {
        if (count === +number) {
            clearInterval(interval);
        }
        targetElemnt.innerText = `${count++}${suffix}`;
    }, delay);
}

numbersAnimation(
    urlParams.get("score"),
    document.getElementById("score"),
    10,
    "%"
);

numbersAnimation(
    urlParams.get("correctAnswers"),
    document.getElementById("correct-answers"),
    100
);

numbersAnimation(
    urlParams.get("incorrectAnswers"),
    document.getElementById("wrong-answers"),
    100
);

numbersAnimation(
    urlParams.get("unanswered"),
    document.getElementById("unanswered"),
    100
);

if (urlParams.get("score") < 60) {
    const status = document.getElementById("status");
    status.innerText = "Failed";
    status.style.color = "red";
    document.getElementById("icon").innerHTML = `
            <lord-icon
                src="https://cdn.lordicon.com/azxkyjta.json"
                trigger="loop"
                stroke="bold"
                state="loop-roll"
                class="mt-3 size-32"
                id="icon"
            >
            </lord-icon>`;
    document.getElementById(
        "title"
    ).innerText = `Sorry ${user.firstName}, you did not pass this time.`;
    document.getElementById(
        "subtitle"
    ).innerText = `Don't be discouraged! Keep pushing, and success will follow.`;
} else {
    document.getElementById(
        "title"
    ).innerText = `Congratiolations, ${user.firstName}`;
}
