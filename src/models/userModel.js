import { API_BASE } from "../shared/constants/api.js"

const AUTH_KEY = "authToken"

export function getAuthToken() {
  return localStorage.getItem(AUTH_KEY)
}

export function setAuthToken(token) {
  localStorage.setItem(AUTH_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_KEY)
}

export function createAuthToken(userId) {
  return btoa(`${userId}:${Date.now()}`)
}

export function parseAuthToken(token) {
  if (!token) return null
  try {
    const decoded = atob(token)
    const [userId] = decoded.split(":")
    return userId || null
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const token = getAuthToken()
  const userId = parseAuthToken(token)
  if (!userId) return null

  const res = await fetch(`${API_BASE}/users/${userId}`)
  if (!res.ok) return null

  return res.json()
}

export async function getUser() {
  return getCurrentUser()
}

export async function updateUser(user) {
  if (!user || !user.id) return null

  const res = await fetch(`${API_BASE}/users/${user.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })

  if (!res.ok) return null
  return res.json()
}

async function patchUser(userId, fields) {
  if (!userId || !fields) return null

  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(fields)
  })

  if (!res.ok) return null
  return res.json()
}

export async function addXP(amount) {
  const user = await getCurrentUser()
  if (!user) return null

  const xp = (user.xp || 0) + Number(amount || 0)
  const level = 1 + Math.floor(xp / 100)

  return patchUser(user.id, { xp, level })
}

export async function setDaltonismType(type) {
  const user = await getCurrentUser()
  if (!user) return null

  return patchUser(user.id, {
    daltonismType: type,
    colorScheme: "auto"
  })
}

export async function setColorScheme(colorScheme) {
  const user = await getCurrentUser()
  if (!user) return null

  return patchUser(user.id, { colorScheme: colorScheme || "auto" })
}

export async function setDisplayMode(displayMode) {
  const user = await getCurrentUser()
  if (!user) return null

  return patchUser(user.id, { displayMode: displayMode || "light" })
}

export async function setProfileImage(profileImage) {
  const user = await getCurrentUser()
  if (!user) return null

  return patchUser(user.id, { profileImage: profileImage || "" })
}

export async function setUsername(username) {
  const trimmedUsername = String(username || "").trim()
  if (!trimmedUsername) {
    return { success: false, message: "Username is required" }
  }

  const user = await getCurrentUser()
  if (!user) {
    return { success: false, message: "Unable to load user" }
  }

  if (trimmedUsername === user.username) {
    return { success: true, user }
  }

  const existingRes = await fetch(
    `${API_BASE}/users?username=${encodeURIComponent(trimmedUsername)}`
  )

  if (!existingRes.ok) {
    return { success: false, message: "Unable to validate username" }
  }

  const existingUsers = await existingRes.json()
  const alreadyTaken = existingUsers.some((existingUser) => existingUser.id !== user.id)
  if (alreadyTaken) {
    return { success: false, message: "Username already exists" }
  }

  const updatedUser = await patchUser(user.id, { username: trimmedUsername })
  if (!updatedUser) {
    return { success: false, message: "Unable to change username" }
  }

  return {
    success: true,
    user: updatedUser
  }
}

export async function recordQuizResult(score, total) {
  const user = await getCurrentUser()
  if (!user) return null

  const quizzesCompleted = (user.quizzesCompleted || 0) + 1
  const perfectQuizzes =
    (user.perfectQuizzes || 0) + (score === total ? 1 : 0)
  const highScore = Math.max(user.highScore || 0, score || 0)

  return patchUser(user.id, {
    quizzesCompleted,
    perfectQuizzes,
    highScore
  })
}

export function logout() {
  clearAuthToken()
}
