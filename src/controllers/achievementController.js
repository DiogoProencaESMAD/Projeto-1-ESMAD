import {
  ACHIEVEMENT_DEFINITIONS,
  achievementModel
} from "../models/achievementModel.js"
import { getUser } from "../models/userModel.js"
import { initChatOverlay } from "../shared/components/chatOverlay.js"
import { escapeHtml } from "../shared/utils/dom.js"
import { applyDaltonismTheme } from "../shared/utils/theme.js"

export async function initAchievements() {
  initChatOverlay()

  const listEl = document.getElementById("achievementsList")
  const xpBarEl = document.getElementById("xpBar")
  const xpTextEl = document.getElementById("xpText")

  if (!listEl) return

  // Bottom navigation buttons
  const goProfile = document.getElementById("goProfile")
  const goQuiz = document.getElementById("goQuiz")
  const goCamera = document.getElementById("goCamera")
  const goChat = document.getElementById("goChat")

  if (goProfile) {
    goProfile.addEventListener("click", () => {
      window.location.href = "/src/views/profile.html"
    })
  }

  if (goQuiz) {
    goQuiz.addEventListener("click", () => {
      window.location.href = "/src/views/quiz.html"
    })
  }

  if (goCamera) {
    goCamera.addEventListener("click", () => {
      window.location.href = "/src/views/camera.html"
    })
  }

  // `initChatOverlay()` attaches the click handler for `goChat`.

  const user = await getUser()

  if (!user) {
    window.location.href = "./auth/login.html"
    return
  }

  applyDaltonismTheme(user)
  const xp = user.xp || 0
  const level = user.level || 1
  const currentLevelXP = xp % 100
  const percent = (currentLevelXP / 100) * 100
  const levelValueEl = document.getElementById("levelValue")

  if (xpBarEl) {
    xpBarEl.style.width = `${percent}%`
  }

  if (xpTextEl) {
    xpTextEl.textContent = `XP: ${currentLevelXP} / 100`
  }

  if (levelValueEl) {
    levelValueEl.textContent = `Level ${level}`
  }

  const unlockedAchievements = await achievementModel.getAll(user.id)
  const unlockedIds = new Set(
    (unlockedAchievements || []).map((achievement) => achievement.achievementId)
  )
  const orderedAchievements = [...ACHIEVEMENT_DEFINITIONS].sort((a, b) => {
    return (a.difficulty || 999) - (b.difficulty || 999)
  })

  listEl.innerHTML = orderedAchievements
    .map((a) => {
      const unlocked = unlockedIds.has(a.achievementId)
      const cardClasses = unlocked
        ? "theme-achievement-card rounded-2xl p-4 shadow-sm flex items-center gap-4"
        : "theme-achievement-card-muted rounded-2xl p-4 shadow-sm flex items-center gap-4 opacity-80"
      const titleClasses = unlocked ? "theme-text font-bold text-lg" : "theme-muted-text font-bold text-lg"
      const descriptionClasses = unlocked ? "theme-muted-text text-sm" : "theme-muted-text text-sm"

      return `
    <div class="${cardClasses}">
      <div class="flex-1">
        <h4 class="${titleClasses}">
          ${escapeHtml(a.title)}
        </h4>
        <p class="${descriptionClasses}">
          ${escapeHtml(a.description)}
        </p>
      </div>
      ${unlocked ? "" : "<span class='theme-muted-text text-xs font-semibold uppercase tracking-[0.15em]'>Locked</span>"}
    </div>
  `
    })
    .join("")
}
