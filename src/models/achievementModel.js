import { API_BASE } from "../shared/constants/api.js"

export const ACHIEVEMENT_DEFINITIONS = [
  {
    achievementId: "first_quiz",
    title: "First Steps",
    description: "Complete your first quiz",
    difficulty: 1
  },
  {
    achievementId: "apprentice",
    title: "Color Apprentice",
    description: "Score at least 5 points in a quiz",
    difficulty: 2
  },
  {
    achievementId: "sharp_eye",
    title: "Sharp Eye",
    description: "Score at least 7 points in a quiz",
    difficulty: 3
  },
  {
    achievementId: "xp_50",
    title: "Getting Started",
    description: "Reach 50 XP",
    difficulty: 4
  },
  {
    achievementId: "almost_perfect",
    title: "Almost Perfect",
    description: "Score at least 9 points in a quiz",
    difficulty: 5
  },
  {
    achievementId: "level_2",
    title: "Level Up",
    description: "Reach level 2",
    difficulty: 6
  },
  {
    achievementId: "master",
    title: "Color Master",
    description: "Get a perfect quiz score",
    difficulty: 7
  },
  {
    achievementId: "quiz_trio",
    title: "Quiz Trio",
    description: "Complete 3 quizzes",
    difficulty: 8
  },
  {
    achievementId: "xp_100",
    title: "Hundred Club",
    description: "Reach 100 XP",
    difficulty: 9
  },
  {
    achievementId: "quiz_regular",
    title: "Quiz Regular",
    description: "Complete 5 quizzes",
    difficulty: 10
  },
  {
    achievementId: "perfect_three",
    title: "Perfect Three",
    description: "Get 3 perfect quiz scores",
    difficulty: 11
  },
  {
    achievementId: "xp_250",
    title: "XP Collector",
    description: "Reach 250 XP",
    difficulty: 12
  },
  {
    achievementId: "quiz_veteran",
    title: "Quiz Veteran",
    description: "Complete 10 quizzes",
    difficulty: 13
  },
  {
    achievementId: "perfect_five",
    title: "Perfect Five",
    description: "Get 5 perfect quiz scores",
    difficulty: 14
  },
  {
    achievementId: "level_5",
    title: "Rising Star",
    description: "Reach level 5",
    difficulty: 15
  },
  {
    achievementId: "xp_500",
    title: "XP Machine",
    description: "Reach 500 XP",
    difficulty: 16
  }
]

export const achievementModel = {
  async getAll(userId) {
    if (!userId) return []

    const res = await fetch(
      `${API_BASE}/achievements?userId=${encodeURIComponent(userId)}`
    )
    if (!res.ok) return []

    return res.json()
  },

  async unlock(userId, achievementId, title, description) {
    if (!userId) return

    const existsRes = await fetch(
      `${API_BASE}/achievements?userId=${encodeURIComponent(
        userId
      )}&achievementId=${encodeURIComponent(achievementId)}`
    )
    const existing = await existsRes.json()
    if (existing.length) return

    await fetch(`${API_BASE}/achievements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        achievementId,
        title,
        description,
        unlockedAt: Date.now()
      })
    })
  }
}
