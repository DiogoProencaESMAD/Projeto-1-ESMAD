import { quizModel } from "../models/quizModel.js"
import { loadQuizQuestions } from "../services/quizService.js"
import { achievementModel } from "../models/achievementModel.js"
import { getUser, addXP, recordQuizResult } from "../models/userModel.js"
import { initChatOverlay } from "../shared/components/chatOverlay.js"
import { applyDaltonismTheme } from "../shared/utils/theme.js"

export async function initQuiz() {
  initChatOverlay()

  const questionEl = document.getElementById("question")
  const answersEl = document.getElementById("answers")
  const resultEl = document.getElementById("result")
  const nextBtn = document.getElementById("nextBtn")

  if (!questionEl || !answersEl || !resultEl || !nextBtn) {
    console.error("Quiz page elements not found")
    return
  }

  let resultsShown = false
  let answering = false

  function getRandomQuestions(data, amount) {
    const questions = Array.isArray(data) ? [...data] : []

    for (let i = questions.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1))
      ;[questions[i], questions[randomIndex]] = [questions[randomIndex], questions[i]]
    }

    return questions.slice(0, amount)
  }

  try {
    const data = await loadQuizQuestions()
    const questions = getRandomQuestions(data, 10)

    quizModel.setQuestions(questions)
  } catch (err) {
    console.error(err)
    questionEl.textContent = "Failed to load quiz data"
    answersEl.innerHTML = ""
    return
  }

  const currentUser = await getUser()
  if (!currentUser) {
    window.location.href = "./auth/login.html"
    return
  }

  applyDaltonismTheme(currentUser)
  nextBtn.classList.add("hidden")

  function render() {
    const q = quizModel.getCurrentQuestion()

    if (!q) {
      if (quizModel.isFinished()) {
        showResults()
      } else {
        questionEl.textContent = "Loading question..."
        answersEl.innerHTML = ""
        nextBtn.disabled = true
      }
      return
    }

    answering = false

    questionEl.textContent = q.question
    answersEl.innerHTML = ""
    resultEl.innerHTML = ""

    q.answers.forEach((answerText, index) => {
      const btn = document.createElement("button")
      btn.type = "button"
      btn.textContent = answerText
      btn.classList.add("quiz-answer-btn")

      btn.onclick = () => {
        if (answering) return

        answering = true
        answersEl.querySelectorAll("button").forEach((button) => {
          button.disabled = true
        })
        btn.classList.add("is-selected")

        window.setTimeout(() => {
          quizModel.answer(index)
          render()
        }, 150)
      }

      answersEl.appendChild(btn)
    })
  }

  async function showResults() {
    if (resultsShown) return
    resultsShown = true

    const score = quizModel.score
    const total = quizModel.questions.length
    const xpGained = score * 10
    const statsUser = await recordQuizResult(score, total)
    const updatedUser = await addXP(xpGained)
    const finalUser = {
      ...currentUser,
      ...statsUser,
      ...updatedUser
    }

    const unlock = (achievementId, title, description) =>
      achievementModel.unlock(currentUser.id, achievementId, title, description)

    await unlock("first_quiz", "First Steps", "Completed your first quiz")

    if (score >= 5) {
      await unlock("apprentice", "Color Apprentice", "Scored at least 5 points")
    }

    if (score >= 7) {
      await unlock("sharp_eye", "Sharp Eye", "Scored at least 7 points in a quiz")
    }

    if (score >= 9) {
      await unlock(
        "almost_perfect",
        "Almost Perfect",
        "Scored at least 9 points in a quiz"
      )
    }

    if (score === total) {
      await unlock("master", "Color Master", "Perfect quiz score")
    }

    if ((finalUser.quizzesCompleted || 0) >= 3) {
      await unlock("quiz_trio", "Quiz Trio", "Completed 3 quizzes")
    }

    if ((finalUser.quizzesCompleted || 0) >= 5) {
      await unlock("quiz_regular", "Quiz Regular", "Completed 5 quizzes")
    }

    if ((finalUser.quizzesCompleted || 0) >= 10) {
      await unlock("quiz_veteran", "Quiz Veteran", "Completed 10 quizzes")
    }

    if ((finalUser.perfectQuizzes || 0) >= 3) {
      await unlock("perfect_three", "Perfect Three", "Got 3 perfect quiz scores")
    }

    if ((finalUser.perfectQuizzes || 0) >= 5) {
      await unlock("perfect_five", "Perfect Five", "Got 5 perfect quiz scores")
    }

    if ((finalUser.xp || 0) >= 50) {
      await unlock("xp_50", "Getting Started", "Reached 50 XP")
    }

    if ((finalUser.xp || 0) >= 100) {
      await unlock("xp_100", "Hundred Club", "Reached 100 XP")
    }

    if ((finalUser.xp || 0) >= 250) {
      await unlock("xp_250", "XP Collector", "Reached 250 XP")
    }

    if ((finalUser.xp || 0) >= 500) {
      await unlock("xp_500", "XP Machine", "Reached 500 XP")
    }

    if ((finalUser.level || 1) >= 2) {
      await unlock("level_2", "Level Up", "Reached level 2")
    }

    if ((finalUser.level || 1) >= 5) {
      await unlock("level_5", "Rising Star", "Reached level 5")
    }

    questionEl.textContent = "Quiz finished"
    answersEl.innerHTML = ""

    resultEl.innerHTML = `
      <p><strong>Score:</strong> ${score}/${total}</p>
      <p><strong>XP gained:</strong> ${xpGained}</p>
      <p><strong>Level:</strong> ${finalUser.level || currentUser.level}</p>
    `

    nextBtn.classList.remove("hidden")
    nextBtn.textContent = "Back to Profile"
    nextBtn.onclick = (e) => {
      e.preventDefault()
      window.location.href = "./profile.html?refresh=true"
    }
  }

  render()
}
