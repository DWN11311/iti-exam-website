export const db = {
  get(key) {
    try {
      return JSON.parse(localStorage[key]);
    } catch {
      console.error("Could not find data with given key");
      return undefined;
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

// get
// [{}, {}]

// set
// [{}, {}]
