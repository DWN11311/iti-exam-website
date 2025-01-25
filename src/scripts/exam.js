let currentQuestion = 1;
let exam = {};

async function getExam() {
    const url = "/src/scripts/data/data.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();

        exam = json;
        displayQuestionsButtons();
        timer(exam.examDuration);
        changeQuestion(1);
    } catch (error) {
        console.error(error.message);
    }
}
getExam();

function timer(examDurationInSeconds) {
    const timer = document.getElementById("timer");

    const interval = setInterval(() => {
        const remainingMinutes = Math.floor(examDurationInSeconds / 60);
        const remainingSeconds = examDurationInSeconds % 60;

        timer.innerText = `${
            remainingMinutes < 10 ? "0" : ""
        }${remainingMinutes}:${
            remainingSeconds < 10 ? "0" : ""
        }${remainingSeconds}`;

        if (examDurationInSeconds < 295) {
            timer.classList.toggle("text-red-500");
        }

        examDurationInSeconds--;
        if (examDurationInSeconds === -1) {
            clearInterval(interval);
            console.log("ended");
        }
    }, 1000);
}

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
    if (e.key === "f" || e.key === "F") {
        toggleFlagQuestion(currentQuestion);
    }
});

document.querySelector("body").addEventListener("click", (e) => {
    if (e.target.classList.contains("answer")) {
        e.target.children[0].checked = true;
    }
    if (e.target.id === "next-btn") {
        nextQuestion();
    }
    if (e.target.id === "previous-btn") {
        previousQuestion();
    }
    if (e.target.classList.contains("question-btn")) {
        currentQuestion = e.target.getAttribute("data-question-number");
        changeQuestion(e.target.getAttribute("data-question-number"));
    }
    if (e.target.id === "flag-question") {
        toggleFlagQuestion(currentQuestion);
    }
});

// function goToQuestion(questionNumber) {}

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
    const questionBtn = document
        .querySelector(`button[data-question-number="${questionNumber}"]`)
        .classList.toggle("flag");
}

function changeQuestion(questionNumber) {
    const questionIndex = questionNumber - 1;
    document.getElementById("current-question").innerText = questionNumber;
    document.getElementById("total-questions").innerText =
        exam.questions.length;
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
        answer.appendChild(radio);
        const span = document.createElement("span");
        span.innerText = question.answers[i].content;
        answer.appendChild(span);
        answers.appendChild(answer);
    }
    const questionBtns = document.querySelectorAll(".question-btn");

    questionBtns.forEach((button, i) => {
        console.log();
        button.classList.remove("bg-green-500");
    });

    document
        .querySelector(`button[data-question-number="${questionNumber}"]`)
        .classList.add("bg-green-500");
}

function displayQuestionsButtons() {
    for (let i = 0; i < exam.questions.length; i++) {
        const button = document.createElement("button");
        button.classList.add(
            "relative",
            "w-16",
            "py-2",
            "text-center",
            "text-white",
            "bg-gray-400",
            "rounded-lg",
            "after:animate-bounce",
            "transition-colors",
            "question-btn",
            "box-border"
        );
        button.innerText = i + 1;
        button.setAttribute("data-question-number", i + 1);
        document.getElementById("questions-btns").appendChild(button);
    }
}
