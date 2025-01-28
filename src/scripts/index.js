if (!localStorage["currentUser"]) {
  window.location = "login.html";
}

import { loadExams } from "./main.js";
import { User } from "./data/user.js";
const examsContainer = document.querySelector("#exams-container");
const user = User.find(localStorage["currentUser"]);

// Load nav and hero names
document.querySelector("#nav-name").innerText = user.firstName;
document.querySelector("#hero-name").innerText = user.firstName;

// Logout button
document.querySelector("#logout-btn").addEventListener("click", function () {
  localStorage["currentUser"] = "";
  window.location = "login.html";
});

// Load exam selection
loadExams()
  .then((exams) => {
    exams.forEach((exam) => {
      const examElem = document.createElement("div");
      examElem.classList.add(
        "flex",
        "flex-col",
        "flex-1",
        "p-3",
        "bg-white",
        "rounded-lg"
      );

      examElem.innerHTML = `
        <div class="flex items-center justify-between w-full">
            <i class="text-2xl fa-solid fa-code"></i>
            <p class="text-xl text-gray-700">${Math.floor(
              exam.examDuration / 60
            )} mins</p>
        </div>

        <p class="mt-3 font-bold">${exam.title}</p>

        <p class="flex-grow mt-3 text-gray-600">
            ${exam.description}
        </p>

        <span class="relative inline-block w-full mt-3">
            <span
                class="absolute right-[-5px] top-[-5px] z-50 flex size-4">
                <span class="absolute inline-flex w-full h-full bg-purple-600 rounded-full opacity-75 animate-ping"></span>
                <span class="relative inline-flex bg-purple-500 rounded-full size-4"></span>
            </span>
            <button data-exam-id="${
              exam.id
            }" class="relative w-full px-4 py-2 text-white transition border rounded-lg bg-primary-500 hover:bg-gray-500 hover:text-white active:bg-gray-600">
                Start Exam
            </button>
        </span>
    `;
      examsContainer.append(examElem);
    });
  })
  .catch((err) => {});

// Load user exam history
const recentExamsContainer = document.querySelector("#recent-exams");
const noRecentExams = document.querySelector("#no-recent-exams");

if (user.examAttempts.length > 0) {
  noRecentExams.classList.add("hidden");
  recentExamsContainer.classList.remove("hidden");
  user.examAttempts.forEach((attempt) => {
    const row = document.createElement("div");
    row.classList.add(
      "flex",
      "w-full",
      "bg-white",
      "border-b",
      "border-gray-200"
    );

    row.innerHTML = `
    <div class="flex-1 p-2">${attempt.title}</div>
    <div class="flex-1 p-2">${attempt.date}</div>
    <div class="flex-1 p-2">${attempt.grade}</div>
    <div class="flex-1 p-2">
    <span class="p-1 text-xs text-white bg-green-400 rounded-xl">${attempt.status}</span>`;

    recentExamsContainer.append(row);
  });
}
