import { API_BASE } from "../shared/constants/api.js"
import {
  createAuthToken,
  setAuthToken
} from "../models/userModel.js"

export async function registerUser(username, password, role) {
  if (!username || !password) {
    return { success: false, message: "Username and password are required" }
  }

  if (password.length < 4) {
    return { success: false, message: "Password must be at least 4 characters" }
  }

  const usersResp = await fetch(
    `${API_BASE}/users?username=${encodeURIComponent(username)}`
  )

  if (!usersResp.ok) {
    return { success: false, message: "Unable to connect to server" }
  }

  const existingUsers = await usersResp.json()

  if (existingUsers.length) {
    return { success: false, message: "User already exists" }
  }

  const newUser = {
    username,
    password,
    role,
    xp: 0,
    level: 1,
    daltonismType: "",
    colorScheme: "auto",
    displayMode: "light",
    profileImage: "",
    quizzesCompleted: 0,
    perfectQuizzes: 0,
    highScore: 0
  }

  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newUser)
  })

  if (!res.ok) {
    return { success: false, message: "Unable to create account" }
  }

  const createdUser = await res.json()
  const token = createAuthToken(createdUser.id)
  setAuthToken(token)

  return {
    success: true,
    user: createdUser
  }
}

export async function loginUser(username, password) {
  const res = await fetch(
    `${API_BASE}/users?username=${encodeURIComponent(username)}`
  )

  if (!res.ok) {
    return {
      success: false,
      message: "Unable to connect to authentication server"
    }
  }

  const users = await res.json()
  const user = users[0]

  if (!user || user.password !== password) {
    return {
      success: false,
      message: "Invalid credentials"
    }
  }

  const token = createAuthToken(user.id)
  setAuthToken(token)

  return {
    success: true,
    user
  }
}
