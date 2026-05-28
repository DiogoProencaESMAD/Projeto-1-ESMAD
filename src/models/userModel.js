const USERS_KEY = "users"

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || []
}

export function saveUsers(users) {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  )
}

export function addUser(user) {
  const users = getUsers()

  users.push(user)

  saveUsers(users)
}