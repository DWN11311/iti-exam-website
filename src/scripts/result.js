import { User } from './data/user.js'
const user = User.find(localStorage['currentUser'])

// Load nav and hero names
if (document.querySelector('#nav-name')) {
    document.querySelector('#nav-name').innerText = user.firstName
}

if (document.querySelector('#hero-name')) {
    document.querySelector('#hero-name').innerText = user.firstName
}

// Logout button
document.querySelector('#logout-btn').addEventListener('click', function () {
    localStorage['currentUser'] = ''
    window.location = 'login.html'
})

const queryString = document.location.search
const urlParams = new URLSearchParams(queryString)

document.getElementById('date').innerText = user.examAttempts.filter(
    (exam) => exam.examId === urlParams.get('examId')
)[0].date

function numbersAnimation(number, targetElemnt, delay, suffix = '') {
    let count = 0
    setTimeout(() => {
        const interval = setInterval(() => {
            if (count === +number) {
                clearInterval(interval)
            }
            targetElemnt.innerText = `${count++}${suffix}`
        }, delay)
    }, 600)
}

numbersAnimation(
    urlParams.get('score'),
    document.getElementById('score'),
    10,
    '%'
)

numbersAnimation(
    urlParams.get('correctAnswers'),
    document.getElementById('correct-answers'),
    150
)

numbersAnimation(
    urlParams.get('incorrectAnswers'),
    document.getElementById('wrong-answers'),
    150
)

numbersAnimation(
    urlParams.get('unanswered'),
    document.getElementById('unanswered'),
    150
)

if (urlParams.get('score') < 60) {
    const status = document.getElementById('status')
    status.innerText = 'Failed'
    status.style.color = 'red'
    document.getElementById('icon').innerHTML = `
            <lord-icon
                src="https://cdn.lordicon.com/azxkyjta.json"
                trigger="loop"
                stroke="bold"
                state="loop-roll"
                class="mt-3 size-32"
                id="icon"
            >
            </lord-icon>`
    document.getElementById('title').innerText =
        `Sorry ${user.firstName}, you did not pass this time.`
    document.getElementById('subtitle').innerText =
        `Don't be discouraged! Keep pushing, and success will follow.`
} else {
    document.getElementById('title').innerText =
        `Congratiolations, ${user.firstName}`
}

document.getElementById('star-rating').addEventListener('click', (e) => {
    if (e.target.value) {
        User.setAttemptRating(
            user.email,
            urlParams.get('examId'),
            +e.target.value
        )
    }
})
