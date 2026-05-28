import {
  getUsers,
  addUser
} from "../models/userModel.js"

export function registerUser(
  username,
  password,
  role
) {
  const users = getUsers()

  const exists = users.find(
    user => user.username === username
  )

  if (exists) {
    return {
      success: false,
      message: "User already exists"
    }
  }

  const newUser = {
    id: Date.now().toString(),
    username,
    password,
    role
  }

  addUser(newUser)

  return { success: true }
}

export function loginUser(
  username,
  password
) {
  const users = getUsers()

  const user = users.find(
    user =>
      user.username === username &&
      user.password === password
  )

  if (!user) {
    return {
      success: false,
      message: "Invalid credentials"
    }
  }

  localStorage.setItem(
    "currentUser",
    JSON.stringify(user)
  )

  return {
    success: true,
    user
  }
}