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

export function generateId() {
  if (!localStorage.idCounter) {
    localStorage.clear();
    db.set("idCounter", 0);
  }

  return localStorage.idCounter++;
}

export function validate(regex, inputWrapper, errorMessage) {
  if (!regex.test(inputWrapper[0].value)) {
    inputWrapper[1].innerText = errorMessage;
    inputWrapper.classList.add("invalid");
  }
  inputWrapper.classList.remove("invalid");
}

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
