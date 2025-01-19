import { generateId } from "../main.js";
import { Answer } from "./answer.js";

export class Question {
  constructor(id, title, answers, correctAnswerId) {
    this.id = id;
    this.title = title;
    this.answers = answers;
    this.correctAnswerId = correctAnswerId;
  }

  static verifyAnswer(answer, pickedAnswerId) {
    if (answer.correctAnswerId === pickedAnswerId) {
      return true;
    }
    return false;
  }
}
