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

  if (xpBarEl) {
    xpBarEl.style.width = `${percent}%`
  }

  if (xpTextEl) {
    xpTextEl.textContent = `XP: ${xp} | Level: ${level}`
  }

  const unlockedAchievements = await achievementModel.getAll(user.id)
  const unlockedIds = new Set(
    (unlockedAchievements || []).map((achievement) => achievement.achievementId)
  )
  const orderedAchievements = [...ACHIEVEMENT_DEFINITIONS].sort((a, b) => {
    return (a.difficulty || 999) - (b.difficulty || 999)
  })

  listEl.innerHTML = orderedAchievements
    .map(
      (a) => `
    <div class="ach ${unlockedIds.has(a.achievementId) ? "unlocked" : "locked"}">
      <div class="title">${escapeHtml(a.title)}</div>
      <div class="desc">${escapeHtml(a.description)}</div>
    </div>
  `
    )
    .join("")
}
