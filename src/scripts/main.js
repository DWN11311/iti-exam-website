// apply FontAwsome CDN in all pages
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href =
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css';
link.integrity =
    'sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==';
link.crossOrigin = 'anonymous';
link.referrerPolicy = 'no-referrer';

// Append the link tag to the <head> of the document
document.head.appendChild(link);

export const db = {
    get(key) {
        try {
            return JSON.parse(localStorage[key]);
        } catch {
            return null;
        }
    },
    set(key, value) {
        localStorage[key] = JSON.stringify(value);
    },
};

export function shuffle(array) {
    let originalArray = [...array];
    let shuffledArray = [];

    for (let i = 0; i < array.length; i++) {
        let randomIndex = Math.floor(Math.random() * originalArray.length);
        shuffledArray.push(originalArray[randomIndex]);
        originalArray.splice(randomIndex, 1);
    }

    return shuffledArray;
}

export function shuffleExam(exam) {
    let questions = [...exam.questions];
    for (let i = 0; i < questions.length; i++) {
        questions[i].answers = shuffle(questions[i].answers);
    }
    exam.questions = shuffle(questions);
    return exam;
}

// call this method at the beginning of JS files to make the page inaccessible
export function checkAuth() {
    if (!localStorage['currentUser']) {
        window.location = 'login.html';
    }
}

const navContainer = document.getElementById('nav');

if (navContainer) {
    // Set the innerHTML of the nav container
    navContainer.innerHTML = `
        <nav
            class="flex flex-col items-center justify-between gap-5 px-5 py-5 border-2 md:flex-row border-b-primary-700 drop-shadow-lg"
        >
            <a href="index.html" class="flex gap-3 items-center" id="logo">
                <img src='src/images/exam-result-svgrepo-com.svg' class='w-10 h-10'>
                <span id="exam-title" class="text-2xl font-semibold">
                    inQorrect
                </span>
            </a>
            <div class="flex items-center gap-5">
                <div>Welcome, <span id="nav-name"></span></div>
                <button class="relative group">
                    <lord-icon
                        src="https://cdn.lordicon.com/kdduutaw.json"
                        trigger="hover"
                        stroke="bold"
                        colors="primary:#121331,secondary:#000000"
                    ></lord-icon>
                    <div
                        id="logout-btn"
                        class="absolute hidden m-2 overflow-hidden duration-500 bg-white border-2 border-gray-500 rounded-lg -right-2 group-hover:block -bottom-12"
                    >
                        <div
                            class="flex items-center gap-2 p-2 transition hover:bg-red-300"
                        >
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <div>Logout</div>
                        </div>
                    </div>
                </button>
            </div>
        </nav>
    `;
}
