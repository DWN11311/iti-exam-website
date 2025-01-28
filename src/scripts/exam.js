import { shuffle } from "./main.js";

let currentQuestion = 1;
let exam = {};

let flagBtn = document.getElementById("flag-question");
let nextBtn = document.getElementById("next-btn");
nextBtn.addEventListener("click", nextQuestion);
let previousBtn = document.getElementById("previous-btn");
previousBtn.addEventListener("click", previousQuestion);
flagBtn.addEventListener("click", () => {
  toggleFlagQuestion(currentQuestion);
  updateFlagButton();
});
document.getElementById("questions-btns").addEventListener("click", (e) => {
  if (e.target.classList.contains("question-btn")) {
    currentQuestion = parseInt(e.target.getAttribute("data-question-number"));
    changeQuestion(currentQuestion);
  }
});
document.querySelector(".answers").addEventListener("click", (e) => {
  const answerElement = e.target.closest(".answer");
  if (answerElement) {
    const radio = answerElement.querySelector('input[type="radio"]');
    if (radio) {
      radio.checked = true;
    }
    exam.questions[currentQuestion - 1].userAnswer =
      e.target.getAttribute("data-answer-id");
    document
      .querySelector(`button[data-question-number="${currentQuestion}"]`)
      .classList.add("bg-green-500");
    trackExamProgress();
  }
});

document.getElementById("fullscreen").addEventListener("click", function () {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
});

document.body.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") {
    nextQuestion();
  }
  if (e.key === "ArrowLeft") {
    previousQuestion();
  }
  if (e.code === "KeyF") {
    toggleFlagQuestion(currentQuestion);
    updateFlagButton();
  }
});

async function getExam() {
  const url = "/src/scripts/data/data.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    exam = shuffleExam(data);
    document.getElementById("exam-title").innerText = exam.title;
    displayQuestionsButtons();
    timer(exam.examDuration);
    changeQuestion(1);
  } finally {
  }
  //  catch (error) {
  //     console.error(error.message);
  // }
}
getExam();

function shuffleExam(exam) {
  let questions = [...exam.questions];
  for (let i = 0; i < questions.length; i++) {
    questions[i].answers = shuffle(questions[i].answers);
  }
  exam.questions = shuffle(questions);
  return exam;
}

function timer(examDurationInSeconds) {
  const timer = document.getElementById("timer");

  const interval = setInterval(() => {
    const remainingMinutes = Math.floor(examDurationInSeconds / 60);
    const remainingSeconds = examDurationInSeconds % 60;

    timer.innerText = `${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;

    if (examDurationInSeconds < 295) {
      timer.classList.toggle("text-red-500");
    }

    examDurationInSeconds--;
    if (examDurationInSeconds === -1) {
      clearInterval(interval);
      console.log("time out");
      window.location.href = "/fail.html";
    }
  }, 1000);
}

function nextQuestion() {
  if (currentQuestion < exam.questions.length) {
    currentQuestion++;
    changeQuestion(currentQuestion);
  }
}
function previousQuestion() {
  if (currentQuestion > 1) {
    currentQuestion--;
    changeQuestion(currentQuestion);
  }
}

function toggleFlagQuestion(questionNumber) {
  let index = questionNumber - 1;
  document
    .querySelector(`button[data-question-number="${questionNumber}"]`)
    .classList.toggle("flag");
  exam.questions[index].isFlagged = !exam.questions[index].isFlagged;
  updateFlagButton();
}

function changeQuestion(questionNumber) {
  const questionIndex = questionNumber - 1;
  if (currentQuestion === 1) {
    previousBtn.disabled = true;
  } else {
    previousBtn.disabled = false;
  }
  if (currentQuestion === exam.questions.length) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
  updateFlagButton();
  document.getElementById("current-question").innerText = questionNumber;
  document.getElementById("total-questions").innerText = exam.questions.length;
  const question = exam.questions[questionIndex];
  document.querySelector(".question").innerText = question.title;
  const answers = document.querySelector(".answers");
  answers.innerHTML = "";
  for (let i = 0; i < question.answers.length; i++) {
    const answer = document.createElement("button");
    answer.classList.add(
      "flex",
      "items-center",
      "w-full",
      "p-3",
      "mt-5",
      "transition-colors",
      "border",
      "border-black",
      "answer",
      "bg-primary-900",
      "rounded-xl",
      "hover:bg-primary-800",
      "active:bg-primary-700"
    );
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.classList.add("w-5", "h-5", "mr-3");
    radio.name = "answer";
    const span = document.createElement("span");
    span.innerText = question.answers[i].content;
    answer.setAttribute("data-answer-id", question.answers[i].id);
    span.setAttribute("data-answer-id", question.answers[i].id);
    radio.setAttribute("data-answer-id", question.answers[i].id);
    answer.appendChild(radio);
    answer.appendChild(span);
    answers.appendChild(answer);
  }

  const userAnswer = exam.questions[currentQuestion - 1]?.userAnswer;
  if (userAnswer) {
    document.querySelector(
      `input[type="radio"][data-answer-id="${userAnswer}"]`
    ).checked = true;
  }

  const questionBtns = document.querySelectorAll(".question-btn");

  questionBtns.forEach((button, i) => {
    button.classList.remove("ring-[3px]", "ring-primary-500");
  });

  document
    .querySelector(`button[data-question-number="${questionNumber}"]`)
    .classList.add("ring-[3px]", "ring-primary-500");
}

function displayQuestionsButtons() {
  for (let i = 0; i < exam.questions.length; i++) {
    const button = document.createElement("button");
    button.classList.add(
      "relative",
      "w-16",
      "h-10",
      "py-2",
      "flex",
      "justify-center",
      "items-center",
      "text-center",
      "text-white",
      "bg-gray-400",
      "hover:opacity-70",
      "active:opacity-95",
      "rounded-lg",
      "after:animate-bounce",
      "transition-all",
      "question-btn",
      "focus:outline-none"
    );
    button.innerText = i + 1;
    button.setAttribute("data-question-number", i + 1);
    document.getElementById("questions-btns").appendChild(button);
  }
}

function updateFlagButton() {
  if (exam.questions[currentQuestion - 1].isFlagged) {
    flagBtn.classList.add("activate-flag");
  } else {
    flagBtn.classList.remove("activate-flag");
  }
}

let answeredQuestion = [];
function trackExamProgress() {
  if (!answeredQuestion.includes(currentQuestion)) {
    answeredQuestion.push(currentQuestion);
    renderProgressUI(answeredQuestion.length);
  }
}

function renderProgressUI(answeredQuestionsCount) {
  let totalQuestions = exam.questions.length;
  let answeredQuestionsPercentage = parseInt(
    (answeredQuestionsCount / totalQuestions) * 100
  );
  document.getElementById("answered-questions").innerText =
    answeredQuestionsCount;
  document.getElementById("remining-questions").innerText = totalQuestions;
  document.getElementById(
    "progress-percentage"
  ).innerText = `${answeredQuestionsPercentage}%`;
  document.getElementById(
    "progress-bar"
  ).style.maxWidth = `${answeredQuestionsPercentage}%`;
  if (answeredQuestionsCount === totalQuestions) {
    document.getElementById("sumbit-exam-btn").classList.add("animate-pulse");
  }
}
