import { generateId } from "../main.js";

class Question {
  constructor(id, title, answers, correctAnswerId) {
    this.id = id;
    this.title = title;
    this.answers = answers;
    this.correctAnswerId = correctAnswerId;
  }
}
