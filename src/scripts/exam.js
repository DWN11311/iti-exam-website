import { checkAuth } from './main.js';
import { User } from './data/user.js';
import { ExamAttempt } from './data/examAttempt.js';
import { db } from './main.js';

checkAuth();

const user = User.find(localStorage['currentUser']);

// Redirect user back to dashboard if exam already performed
let params = new URLSearchParams(document.location.search);
let examId = Number(params.get('examId'));
user.examAttempts.forEach((examAttempt) => {
    if (examAttempt.examId == examId) {
        window.location = 'index.html';
    }
});

let currentQuestion = 1;
let exam = {};

let flagBtn = document.getElementById('flag-question');
let nextBtn = document.getElementById('next-btn');
nextBtn.addEventListener('click', nextQuestion);
let previousBtn = document.getElementById('previous-btn');
previousBtn.addEventListener('click', previousQuestion);
flagBtn.addEventListener('click', () => {
    toggleFlagQuestion(currentQuestion);
    updateFlagButton();
});
document.getElementById('questions-btns').addEventListener('click', (e) => {
    if (e.target.classList.contains('question-btn')) {
        currentQuestion = parseInt(
            e.target.getAttribute('data-question-number')
        );
        changeQuestion(currentQuestion);
    }
});
document.querySelector('.answers').addEventListener('click', (e) => {
    const answerElement = e.target.closest('.answer');
    if (answerElement) {
        const radio = answerElement.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
        }
        exam.questions[currentQuestion - 1].userAnswer =
            e.target.getAttribute('data-answer-id');
        document
            .querySelector(`button[data-question-number="${currentQuestion}"]`)
            .classList.add('bg-green-500');
        trackExamProgress();
        db.set('currentExam', exam);
    }
});

document.getElementById('fullscreen').addEventListener('click', function () {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
});

document.body.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
        nextQuestion();
    }
    if (e.key === 'ArrowLeft') {
        previousQuestion();
    }
    if (e.code === 'KeyF') {
        toggleFlagQuestion(currentQuestion);
        updateFlagButton();
    }
});

// Load exam
async function startExam() {
    try {
        if (!db.get('currentExam')) {
            window.location = '/';
        }

        const currentExam = db.get('currentExam');
        exam = currentExam;
        document.getElementById('exam-title').innerText = exam.title;
        displayQuestionsButtons();
        timer(exam.expiresAt, exam.examDuration, exam.id);
        changeQuestion(1);
    } catch (error) {
        document.querySelector('#error-modal').classList.remove('hidden');
        document.querySelector('#error-modal').classList.add('flex');
        document.querySelector('#status').innerText = error.status;
        document.querySelector('#message').innerText = error.statusText;
    } finally {
        document.querySelector('#loader').classList.add('hidden');
        document.getElementById('remining-questions').innerText =
            exam.questions.length;
    }
}
startExam();

// Error modal reload button
document.querySelector('.reload-btn').addEventListener('click', function () {
    document.location.reload();
});

let attemptDuration;
function timer(expiresAt) {
    const timer = document.getElementById('timer');
    let currentTime = Date.now();
    let remainingTime = Math.floor((expiresAt - currentTime) / 1000);

    const interval = setInterval(() => {
        const remainingMinutes = Math.floor(remainingTime / 60);
        const remainingSeconds = remainingTime % 60;
        attemptDuration =
            exam.examDuration - (remainingMinutes * 60 + remainingSeconds);
        if (remainingTime >= 0) {
            timer.innerText = `${
                remainingMinutes < 10 ? '0' : ''
            }${remainingMinutes}:${
                remainingSeconds < 10 ? '0' : ''
            }${remainingSeconds}`;
            if (remainingTime < 295) {
                timer.classList.toggle('text-red-500');
            }
        }
        remainingTime--;
        if (remainingTime < 0) {
            addUserExamAttempt(0, true);
            window.location.href = '/timeout.html?' + examId;
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
        .classList.toggle('flag');
    exam.questions[index].isFlagged = !exam.questions[index].isFlagged;
    db.set('currentExam', exam);
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
    document.getElementById('current-question').innerText = questionNumber;
    document.getElementById('total-questions').innerText =
        exam.questions.length;
    const question = exam.questions[questionIndex];
    document.querySelector('.question').innerText = question.title;
    const answers = document.querySelector('.answers');
    answers.innerHTML = '';
    for (let i = 0; i < question.answers.length; i++) {
        const answer = document.createElement('button');
        answer.classList.add(
            'flex',
            'items-center',
            'w-full',
            'p-3',
            'mt-5',
            'transition-colors',
            'border',
            'border-primary-700',
            'answer',
            'bg-background-950',
            'rounded-xl',
            'hover:bg-primary-900',
            'active:bg-primary-800'
        );
        answer.innerHTML = `
            <input type="radio" data-answer-id="${question.answers[i].id}" class="w-5 h-5 mr-3" name="answer"/>
            <span data-answer-id="${question.answers[i].id}">${question.answers[i].content}</span>
        `;

        answer.setAttribute('data-answer-id', question.answers[i].id);
        answers.appendChild(answer);
    }

    const userAnswer = exam.questions[currentQuestion - 1]?.userAnswer;
    if (userAnswer) {
        document.querySelector(
            `input[type="radio"][data-answer-id="${userAnswer}"]`
        ).checked = true;
    }

    const questionBtns = document.querySelectorAll('.question-btn');

    questionBtns.forEach((button, i) => {
        button.classList.remove('ring-[3px]', 'ring-primary-500');
    });

    document
        .querySelector(`button[data-question-number="${questionNumber}"]`)
        .classList.add('ring-[3px]', 'ring-primary-500');
}

function displayQuestionsButtons() {
    for (let i = 0; i < exam.questions.length; i++) {
        const button = document.createElement('button');
        button.classList.add(
            'relative',
            'basis-16',
            'h-10',
            'py-2',
            'flex',
            'justify-center',
            'items-center',
            'text-center',
            'text-white',
            'bg-gray-400',
            'hover:opacity-70',
            'active:opacity-95',
            'rounded-lg',
            'after:animate-bounce',
            'transition-all',
            'question-btn',
            'focus:outline-none'
        );
        if (exam.questions[i].userAnswer) {
            button.classList.add('bg-green-500');
        }
        if (exam.questions[i].isFlagged) {
            button.classList.add('flag');
        }
        button.innerText = i + 1;
        button.setAttribute('data-question-number', i + 1);
        document.getElementById('questions-btns').appendChild(button);
    }
}

function updateFlagButton() {
    if (exam.questions[currentQuestion - 1].isFlagged) {
        flagBtn.classList.add('activate-flag');
    } else {
        flagBtn.classList.remove('activate-flag');
    }
}

let answeredQuestion = [];
trackExamProgress();
function trackExamProgress() {
    answeredQuestion = exam.questions.filter((question) => {
        return !!question.userAnswer;
    });
    console.log(answeredQuestion);
    renderProgressUI(answeredQuestion.length);
}

function renderProgressUI(answeredQuestionsCount) {
    let totalQuestions = exam.questions.length;
    let answeredQuestionsPercentage = parseInt(
        (answeredQuestionsCount / totalQuestions) * 100
    );
    document.getElementById('answered-questions').innerText =
        answeredQuestionsCount;
    document.getElementById('remining-questions').innerText =
        totalQuestions - answeredQuestionsCount;
    document.getElementById('progress-percentage').innerText =
        `${answeredQuestionsPercentage}%`;
    document.getElementById('progress-bar').style.maxWidth =
        `${answeredQuestionsPercentage}%`;
    if (answeredQuestionsCount === totalQuestions) {
        document
            .getElementById('sumbit-exam-btn')
            .classList.add('animate-pulse');
    }
}

// Exam submitting event
const confirmModal = document.querySelector('#confirm-modal');
document
    .querySelector('#sumbit-exam-btn')
    .addEventListener('click', function () {
        const hasFlaggedQuestion = document.querySelector('.flag');
        if (
            exam.questions.length !== answeredQuestion.length ||
            hasFlaggedQuestion
        ) {
            document.querySelector('#confirm-unanswered').innerText =
                exam.questions.length - answeredQuestion.length;
            document.querySelector('#confirm-flagged').innerText =
                document.querySelectorAll('.flag').length;
            confirmModal.classList.remove('hidden');
            confirmModal.classList.add('flex');
        } else {
            submitExam();
        }
    });

// Confirm modal
confirmModal
    .querySelector('.confirm-button')
    .addEventListener('click', submitExam);

confirmModal
    .querySelector('.cancel-button')
    .addEventListener('click', function () {
        confirmModal.classList.add('hidden');
        confirmModal.classList.remove('flex');
    });

// Submit exam
function submitExam() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    localStorage.currentExam = '';
    // calculate result
    let correctAnswerCount = 0;
    let unansweredCount = 0;
    exam.questions.forEach((question) => {
        if (question.correctAnswerId === question.userAnswer)
            correctAnswerCount++;
        if (!question.userAnswer) unansweredCount++;
    });
    const score = parseInt((correctAnswerCount / exam.questions.length) * 100);
    const params = new URLSearchParams();
    params.set('examId', exam.id);
    params.set('score', score);
    params.set('correctAnswers', correctAnswerCount);
    params.set('unanswered', unansweredCount);
    params.set(
        'incorrectAnswers',
        exam.questions.length - correctAnswerCount - unansweredCount
    );

    addUserExamAttempt(score, false);
    window.location.href = 'result.html?' + params.toString();
}

// timeOut is a boolean to know whether the exam attempt was a timeout or a normal submit
function addUserExamAttempt(score, timedOut) {
    let status;
    if (timedOut) {
        status = 'Timedout';
    } else if (score < 60) {
        status = 'Failed';
    } else {
        status = 'Passed';
    }

    const examAttempt = new ExamAttempt(
        exam.id,
        exam.title,
        score,
        status,
        attemptDuration
    );

    User.addExamAttempt(localStorage['currentUser'], examAttempt);
}
