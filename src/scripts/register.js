import { User } from './data/user.js'
const registerForm = document.querySelector('#register-form')
const submitBtn = document.querySelector('button[type="submit"]')

registerForm.addEventListener('submit', function (e) {
    if (checkFormValidation()) {
        try {
            const user = new User(
                registerForm['fname'].value,
                registerForm['lname'].value,
                registerForm['email'].value,
                registerForm['password'].value
            )
            User.add(user)
            User.auth(
                registerForm['email'].value,
                registerForm['password'].value
            )
            window.location = 'index.html'
        } catch {
            const alreadyExists = document.querySelector('#already-exists')
            alreadyExists.classList.remove('hidden')
            alreadyExists.classList.add('block')
        }
    }
    e.preventDefault()
})
registerForm.reset()

function checkFormValidation() {
    if (
        fnameValid &&
        lnameValid &&
        emailValid &&
        passwordValid &&
        confirmPasswordValid
    ) {
        submitBtn.removeAttribute('disabled')
        return true
    } else {
        submitBtn.setAttribute('disabled', 'true')
        return false
    }
}

const lettersOnlyRegex = /^[a-zA-Z]+$/
const noSpacesRegex = /^\S*$/
const minLengthRegex = /^.{2,}$/

const hasAtSymbolRegex = /@/
const hasDotRegex = /\./

const passwordLengthRegex = /^.{8,16}$/
const uppercaseRegex = /[A-Z]/
const lowercaseRegex = /[a-z]/
const numberRegex = /\d/
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/

// Validates a field using an array of objects that has the tags and regexes
// array ex:
// [
//   { tagId: "fname-letters-tag", regex: lettersOnlyRegex },
//   { tagId: "fname-spaces-tag", regex: noSpacesRegex },
//   { tagId: "fname-length-tag", regex: minLengthRegex },
// ]
function validateField(fieldName, tags) {
    let isValid = true
    tags.forEach(({ tagId, regex }) => {
        const value = registerForm[fieldName].value
        if (!updateValidationTag(tagId, regex, value)) {
            isValid = false
        }
    })
    return isValid
}

// updates a tag based on a regex and a value using its ID
function updateValidationTag(tagId, regex, value) {
    const tag = document.querySelector(`#${tagId}`)
    const tagIcon = tag.querySelector('i')
    if (regex.test(value)) {
        tagIcon.classList.add('text-green-500', 'bg-green-200', 'fa-check')
        tagIcon.classList.remove('bg-red-200', 'text-red-500', 'fa-xmark')
        return true
    } else {
        tagIcon.classList.remove('text-green-500', 'bg-green-200', 'fa-check')
        tagIcon.classList.add('bg-red-200', 'text-red-500', 'fa-xmark')
        return false
    }
}

// Changes the input field visuals when it is blurred to indicate if it is valid or not
function validateOnInputBlur(input, validBool) {
    const validIndicator = input.parentElement.querySelector('.input-valid')
    if (!validBool) {
        validIndicator.classList.add('flex')
        validIndicator.classList.remove('hidden')
        input.classList.remove('border-green-300', 'border-background-800')
        input.classList.add('border-red-300')
    } else {
        validIndicator.classList.add('hidden')
        validIndicator.classList.remove('flex')
        input.classList.add('border-green-300')
        input.classList.remove('border-red-300')
    }
}

// Validate first name
let fnameValid = false
registerForm['fname'].addEventListener('input', function () {
    fnameValid = validateField('fname', [
        { tagId: 'fname-letters-tag', regex: lettersOnlyRegex },
        { tagId: 'fname-spaces-tag', regex: noSpacesRegex },
        { tagId: 'fname-length-tag', regex: minLengthRegex },
    ])
    checkFormValidation()
})

registerForm['fname'].addEventListener('blur', () =>
    validateOnInputBlur(registerForm['fname'], fnameValid)
)

// Validate last name
let lnameValid = false
registerForm['lname'].addEventListener('input', function () {
    lnameValid = validateField('lname', [
        { tagId: 'lname-letters-tag', regex: lettersOnlyRegex },
        { tagId: 'lname-spaces-tag', regex: noSpacesRegex },
        { tagId: 'lname-length-tag', regex: minLengthRegex },
    ])
    checkFormValidation()
})

registerForm['lname'].addEventListener('blur', () =>
    validateOnInputBlur(registerForm['lname'], lnameValid)
)

// Validate email
let emailValid = false
registerForm['email'].addEventListener('input', function () {
    emailValid = validateField('email', [
        { tagId: 'email-at-tag', regex: hasAtSymbolRegex },
        { tagId: 'email-dot-tag', regex: hasDotRegex },
        { tagId: 'email-spaces-tag', regex: noSpacesRegex },
    ])
    checkFormValidation()
})

registerForm['email'].addEventListener('blur', () =>
    validateOnInputBlur(registerForm['email'], emailValid)
)

// Validate password
let passwordValid = false
registerForm['password'].addEventListener('input', function () {
    passwordValid = validateField('password', [
        { tagId: 'pw-length-tag', regex: passwordLengthRegex },
        { tagId: 'pw-upper-tag', regex: uppercaseRegex },
        { tagId: 'pw-lower-tag', regex: lowercaseRegex },
        { tagId: 'pw-num-tag', regex: numberRegex },
        { tagId: 'pw-special-tag', regex: specialCharRegex },
        { tagId: 'pw-spaces-tag', regex: noSpacesRegex },
    ])
    checkFormValidation()
})

registerForm['password'].addEventListener('blur', () =>
    validateOnInputBlur(registerForm['password'], passwordValid)
)

// Validate confirm password
let confirmPasswordValid = false
registerForm['confirm-password'].addEventListener('input', function () {
    const tag = document.querySelector('#confirm-match-tag')
    const tagIcon = tag.querySelector('i')
    if (this.value === registerForm['password'].value) {
        tagIcon.classList.add('text-green-500', 'bg-green-200', 'fa-check')
        tagIcon.classList.remove('bg-red-200', 'text-red-500', 'fa-xmark')
        confirmPasswordValid = true
    } else {
        tagIcon.classList.remove('text-green-500', 'bg-green-200', 'fa-check')
        tagIcon.classList.add('bg-red-200', 'text-red-500', 'fa-xmark')
        confirmPasswordValid = false
    }
    checkFormValidation()
})

registerForm['confirm-password'].addEventListener('blur', () =>
    validateOnInputBlur(registerForm['confirm-password'], confirmPasswordValid)
)

// Toggle password visibility
const togglePasswordBtn = document.querySelector('#toggle-password-btn')
let passwordVisible = false
togglePasswordBtn.addEventListener('click', function () {
    if (passwordVisible) {
        registerForm['password'].setAttribute('type', 'password')
        registerForm['confirm-password'].setAttribute('type', 'password')
        togglePasswordBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>'
    } else {
        registerForm['password'].setAttribute('type', 'text')
        registerForm['confirm-password'].setAttribute('type', 'text')
        togglePasswordBtn.innerHTML = '<i class="fa-solid fa-eye"></i>'
    }
    togglePasswordBtn.classList.toggle('text-primary-800')
    togglePasswordBtn.classList.toggle('text-primary-500')
    passwordVisible = !passwordVisible
})
