export class ExamAttempt {
  constructor(title, grade, status) {
    this.title = title;
    this.date = new Date();
    this.date = this.date.toLocaleDateString("en-GB");
    this.grade = grade;
    this.status = status;
  }
}
