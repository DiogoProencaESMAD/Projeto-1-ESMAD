export const quizModel = {
  questions: [],
  currentIndex: 0,
  score: 0,

  setQuestions(data) {
    this.questions = Array.isArray(data) ? data : []
    this.currentIndex = 0
    this.score = 0
  },

  getCurrentQuestion() {
    return this.questions[this.currentIndex] || null
  },

  answer(index) {
    const q = this.getCurrentQuestion()

    // HARD GUARD (prevents crash)
    if (!q || typeof q.correct !== "number") {
      console.error("Invalid question format:", q)
      return
    }

    if (index === q.correct) {
      this.score++
    }

    this.currentIndex++
  },

  isFinished() {
    return this.currentIndex >= this.questions.length
  }
}