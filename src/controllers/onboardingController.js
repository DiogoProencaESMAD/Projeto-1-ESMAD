import { getUser, setDaltonismType } from "../models/userModel.js"
import { formatDaltonismType } from "../shared/constants/daltonism.js"
import { DALTONISM_TEST_QUESTIONS } from "../shared/constants/daltonismTest.js"
import { applyDaltonismTheme } from "../shared/utils/theme.js"

export async function initDaltonism() {
  const form = document.getElementById("daltonismForm")
  const select = document.getElementById("daltonismType")
  const testPanel = document.getElementById("daltonismTestPanel")
  const testPlate = document.getElementById("testPlate")
  const testProgress = document.getElementById("testProgress")
  const testAnswers = document.getElementById("testAnswers")
  const testResult = document.getElementById("testResult")
  const useEstimatedTypeBtn = document.getElementById("useEstimatedTypeBtn")
  const restartTestBtn = document.getElementById("restartTestBtn")
  const backToSelectionBtn = document.getElementById("backToSelectionBtn")

  if (
    !form ||
    !select ||
    !testPanel ||
    !testPlate ||
    !testProgress ||
    !testAnswers ||
    !testResult ||
    !useEstimatedTypeBtn ||
    !restartTestBtn ||
    !backToSelectionBtn
  ) {
    return
  }

  const user = await getUser()
  if (!user) {
    window.location.href = "../auth/login.html"
    return
  }

  applyDaltonismTheme(user)

  if (user.daltonismType) {
    select.value = user.daltonismType
  }

  const ctx = testPlate.getContext("2d")
  let currentQuestionIndex = 0
  let estimatedType = null
  let scores = createEmptyScores()

  function createEmptyScores() {
    return {
      normal: 0,
      protanopia: 0,
      deuteranopia: 0,
      tritanopia: 0,
      monochromacy: 0
    }
  }

  function showManualSelection() {
    form.classList.remove("hidden")
    testPanel.classList.add("hidden")
  }

  function showTestPanel() {
    form.classList.add("hidden")
    testPanel.classList.remove("hidden")
  }

  async function saveType(type) {
    const updated = await setDaltonismType(type)

    if (!updated) {
      alert("Unable to save vision type. Please try again.")
      return
    }

    Object.assign(user, updated)
    applyDaltonismTheme(updated)
    window.location.href = "../profile.html?refresh=true"
  }

  function randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)]
  }

  function drawPlate(question) {
    if (!ctx) return

    const size = testPlate.width
    const radius = size / 2 - 8
    const center = size / 2

    ctx.clearRect(0, 0, size, size)

    const maskCanvas = document.createElement("canvas")
    maskCanvas.width = size
    maskCanvas.height = size
    const maskCtx = maskCanvas.getContext("2d")

    if (!maskCtx) return

    maskCtx.clearRect(0, 0, size, size)
    maskCtx.fillStyle = "#000"
    maskCtx.font = "bold 128px Arial"
    maskCtx.textAlign = "center"
    maskCtx.textBaseline = "middle"
    maskCtx.fillText(question.number, center, center)

    const maskData = maskCtx.getImageData(0, 0, size, size).data

    for (let i = 0; i < 1800; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.sqrt(Math.random()) * radius
      const x = center + Math.cos(angle) * distance
      const y = center + Math.sin(angle) * distance
      const dotRadius = 5 + Math.random() * 7
      const pixelIndex =
        (Math.floor(y) * size + Math.floor(x)) * 4 + 3
      const isNumberDot = maskData[pixelIndex] > 0

      ctx.beginPath()
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
      ctx.fillStyle = randomFrom(
        isNumberDot ? question.foregroundColors : question.backgroundColors
      )
      ctx.fill()
    }
  }

  function addScores(scoreMap) {
    Object.entries(scoreMap || {}).forEach(([type, value]) => {
      scores[type] += value
    })
  }

  function getEstimatedType() {
    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const [bestType, bestScore] = ranked[0]
    const [, secondScore] = ranked[1]

    if (bestScore <= 1) return "normal"
    if (bestType === "normal" && bestScore >= secondScore) return "normal"
    return bestType
  }

  function finishTest() {
    estimatedType = getEstimatedType()
    select.value = estimatedType
    applyDaltonismTheme({
      ...user,
      daltonismType: estimatedType,
      colorScheme: "auto"
    })

    testResult.classList.remove("hidden")
    testResult.innerHTML = `
      <strong>Estimated result:</strong> ${formatDaltonismType(estimatedType)}<br>
      <span class="inline-note">This is only an estimate, not a medical diagnosis.</span>
    `
    useEstimatedTypeBtn.classList.remove("hidden")
    restartTestBtn.classList.remove("hidden")
    testAnswers.innerHTML = ""
    testProgress.textContent = "Test finished"
  }

  function answerQuestion(answerValue) {
    const question = DALTONISM_TEST_QUESTIONS[currentQuestionIndex]
    const scoreMap = question?.scores?.[answerValue]
    addScores(scoreMap)
    currentQuestionIndex++

    if (currentQuestionIndex >= DALTONISM_TEST_QUESTIONS.length) {
      finishTest()
      return
    }

    renderQuestion()
  }

  function renderQuestion() {
    const question = DALTONISM_TEST_QUESTIONS[currentQuestionIndex]
    if (!question) return

    drawPlate(question)
    testProgress.textContent = `Question ${currentQuestionIndex + 1} of ${DALTONISM_TEST_QUESTIONS.length}`
    testResult.classList.add("hidden")
    useEstimatedTypeBtn.classList.add("hidden")
    restartTestBtn.classList.add("hidden")

    const answerOptions = [
      ...question.choices,
      "I don't see a number",
      "I don't know"
    ]

    testAnswers.innerHTML = ""
    answerOptions.forEach((answerLabel) => {
      const button = document.createElement("button")
      button.type = "button"
      button.textContent = answerLabel
      button.addEventListener("click", () => {
        if (answerLabel === "I don't see a number") {
          answerQuestion("none")
          return
        }
        if (answerLabel === "I don't know") {
          answerQuestion("unknown")
          return
        }
        answerQuestion(answerLabel)
      })
      testAnswers.appendChild(button)
    })
  }

  function startTest() {
    currentQuestionIndex = 0
    estimatedType = null
    scores = createEmptyScores()
    showTestPanel()
    renderQuestion()
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const type = select.value
    if (type === "take-test") {
      startTest()
      return
    }

    await saveType(type)
  })

  useEstimatedTypeBtn.addEventListener("click", async () => {
    if (!estimatedType) return
    await saveType(estimatedType)
  })

  restartTestBtn.addEventListener("click", () => {
    startTest()
  })

  backToSelectionBtn.addEventListener("click", () => {
    showManualSelection()
  })
}
