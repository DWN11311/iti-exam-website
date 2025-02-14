import { checkAuth } from './main.js'
import { User } from './data/user.js'

checkAuth()

const examsContainer = document.querySelector('#exams-container')
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

// Load exam selection
fetch('/src/scripts/data/data.json')
    .then((response) => {
        if (!response.ok) {
            throw response
        }
        return response.json()
    })
    .then((response) => {
        const exams = response.exams
        let numOfExams = 0

        exams.forEach((exam) => {
            const exists = user.examAttempts.find(
                (att) => att.examId == exam.id
            )
            if (!exists) {
                const examElem = document.createElement('div')
                examElem.classList.add(
                    'flex',
                    'flex-col',
                    'p-3',
                    'bg-white',
                    'rounded-lg'
                )
                examElem.innerHTML = `
              <div class="flex items-center justify-between w-full">
              ${exam.icon}
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
                  <button data-id="${
                      exam.id
                  }" class="start-btn relative w-full px-4 py-2 text-white transition border rounded-lg bg-primary-500 hover:bg-gray-500 hover:text-white active:bg-gray-600">
                      Start Exam
                  </button>
              </span>
  
          `
                numOfExams++
                examsContainer.append(examElem)
            }
        })

        if (!numOfExams) {
            document.querySelector('#exams-empty').classList.remove('hidden')
        }
    })
    .catch((error) => {
        const errorStatus = document.getElementById('error-status')
        const errorMessage = document.getElementById('error-message')
        errorStatus.innerText = error.status
        errorMessage.innerText = error.statusText
        document.getElementById('exams-error').classList.remove('hidden')
    })
    .finally(() => {
        document.querySelector('#exams-load').classList.add('hidden')
    })

// Load user exam history
const recentExamsContainer = document.querySelector('#recent-exams')
const noRecentExams = document.querySelector('#no-recent-exams')

if (user.examAttempts.length > 0) {
    noRecentExams.classList.add('hidden')
    recentExamsContainer.classList.remove('hidden')
    user.examAttempts.forEach((attempt) => {
        const row = document.createElement('div')
        row.classList.add(
            'flex',
            'w-full',
            'bg-white',
            'border-b',
            'border-gray-200'
        )

        row.innerHTML = `
    <div class="flex-1 p-2">${attempt.title}</div>
    <div class="flex-1 p-2">${attempt.date}</div>
    <div class="flex-1 p-2">${attempt.grade}%</div>
    <div class="flex-1 p-2">${attempt.attemptDuration} Seconds</div>
    <div class="flex-1 p-2">${
        attempt.rating
    } <i class="fa-solid fa-star text-[#f5b301]"></i></div>
    <div class="flex-1 p-2">
    <span class="p-1 text-xs text-white ${
        attempt.status == 'Passed'
            ? 'bg-green-500'
            : attempt.status == 'Timedout'
              ? 'bg-yellow-500'
              : 'bg-red-500'
    } rounded-xl">${attempt.status}</span>`

        // recentExamsContainer.append(row);
        document.getElementById('table-rows').append(row)
    })
}

// Start exam
examsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('start-btn')) {
        const url = `exam.html?examId=${e.target.dataset.id}`
        window.location = url
    }
})
