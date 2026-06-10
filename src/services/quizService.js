export async function loadQuizQuestions() {
  const res = await fetch("/public/data/quizQuestions.json")

  if (!res.ok) {
    throw new Error("Quiz data not found")
  }

  const data = await res.json()

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Quiz data is empty or invalid")
  }

  return data
}