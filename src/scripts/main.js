// apply FontAwsome CDN in all pages
const link = document.createElement("link");
link.rel = "stylesheet";
link.href =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css";
link.integrity =
  "sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==";
link.crossOrigin = "anonymous";
link.referrerPolicy = "no-referrer";

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

// call this method at the beginning of JS files to make the page inaccessible
export function checkAuth() {
  if (!localStorage["currentUser"]) {
    window.location = "login.html";
  }
}
