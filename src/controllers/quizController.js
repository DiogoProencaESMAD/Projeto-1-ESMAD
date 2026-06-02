import { quizModel } from "../models/quizModel.js"
import { loadQuizQuestions } from "../services/quizService.js"

export async function initQuiz() {
  const questionEl = document.getElementById("question")
  const answersEl = document.getElementById("answers")
  const resultEl = document.getElementById("result")
  const nextBtn = document.getElementById("nextBtn")

  const data = await loadQuizQuestions()
  quizModel.setQuestions(data)

  function render() {
    if (quizModel.isFinished()) {
      questionEl.textContent = "Quiz finished"
      answersEl.innerHTML = ""
      resultEl.textContent = `Score: ${quizModel.score}`
      return
    }

    const q = quizModel.getCurrentQuestion()

    questionEl.textContent = q.question
    answersEl.innerHTML = ""

    q.answers.forEach((a, i) => {
      const btn = document.createElement("button")
      btn.textContent = a

      btn.onclick = () => {
        quizModel.answer(i)
        render()
      }

      answersEl.appendChild(btn)
    })
  }

  nextBtn.onclick = () => {
    render()
  }

  render()
}