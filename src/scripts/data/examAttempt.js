export class ExamAttempt {
    constructor(examId, title, grade, status, attemptDuration) {
        this.examId = examId
        this.title = title
        this.date = new Date()
        this.date = this.date.toLocaleDateString('en-GB')
        this.grade = grade
        this.status = status
        this.rating = 0
        this.attemptDuration = attemptDuration
    }
}
