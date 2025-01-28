import { User } from "./data/user.js";
const loginForm = document.querySelector("form");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^.{8,16}$/;
const submitBtn = document.querySelector('button[type="submit"]');

// check if remember me is checked then fill email if true
// TODO: make proper remember me behavior
if (localStorage["rememberMe"]) {
  loginForm["email"].value = localStorage["rememberMe"];
}

// Log user in or show invalid email or password if account doesn't exist
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (loginForm["remember-me"].checked) {
    localStorage["rememberMe"] = loginForm["email"].value;
  } else {
    localStorage["rememberMe"] = "";
  }

  // NOTE: this returns null if the account doesn't exist
  if (!User.auth(loginForm["email"].value, loginForm["password"].value)) {
    const invalidElem = document.querySelector("#invalid");
    invalidElem.classList.remove("hidden");
  } else {
    window.location = "index.html";
  }
});

// Used to check if form is in a valid state then enables the login button if valid
function checkFormValidation() {
  if (
    emailRegex.test(loginForm["email"].value) &&
    passwordRegex.test(loginForm["password"].value)
  ) {
    submitBtn.removeAttribute("disabled");
    return true;
  }
  submitBtn.setAttribute("disabled", "true");
  return false;
}

// validate email
loginForm["email"].addEventListener("blur", function () {
  const emailError = document.querySelector("#email-error");
  if (!emailRegex.test(this.value)) {
    this.classList.remove("border-background-800");
    this.classList.add("border-red-400");
    emailError.classList.remove("hidden");
    emailError.classList.add("flex");
  } else {
    emailError.classList.add("hidden");
    emailError.classList.remove("flex");
    this.classList.add("border-background-800");
    this.classList.remove("border-red-400");
  }
  checkFormValidation();
});

// validate password
loginForm["password"].addEventListener("blur", function () {
  const passwordError = document.querySelector("#pw-error");
  if (!passwordRegex.test(this.value)) {
    this.classList.remove("border-background-800");
    this.classList.add("border-red-400");
    passwordError.classList.remove("hidden");
    passwordError.classList.add("flex");
  } else {
    passwordError.classList.add("hidden");
    passwordError.classList.remove("flex");
    this.classList.add("border-background-800");
    this.classList.remove("border-red-400");
  }
  checkFormValidation();
});

// Toggle password visibility
const togglePasswordBtn = document.querySelector("#toggle-password-btn");
let passwordVisible = false;
togglePasswordBtn.addEventListener("click", function () {
  if (passwordVisible) {
    loginForm["password"].setAttribute("type", "password");
    togglePasswordBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  } else {
    loginForm["password"].setAttribute("type", "text");
    togglePasswordBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
  }
  togglePasswordBtn.classList.toggle("text-primary-800");
  togglePasswordBtn.classList.toggle("text-primary-500");
  passwordVisible = !passwordVisible;
});
