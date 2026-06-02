export const quizModel = {
  questions: [],
  currentIndex: 0,
  score: 0,

  setQuestions(data) {
    this.questions = data
  },

  getCurrentQuestion() {
    return this.questions[this.currentIndex]
  },

  answer(index) {
    const q = this.getCurrentQuestion()

    if (index === q.correct) {
      this.score++
    }

    this.currentIndex++
  },

  isFinished() {
    return this.currentIndex >= this.questions.length
  },

  reset() {
    this.currentIndex = 0
    this.score = 0
  }
}