export async function loadQuizQuestions() {
  const res = await fetch("/public/data/quizQuestions.json")

  if (!res.ok) {
    throw new Error("Failed to load quiz questions")
  }

  return await res.json()
}