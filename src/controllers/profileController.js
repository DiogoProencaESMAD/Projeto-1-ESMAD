export function initProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser"))
  const daltonismType = localStorage.getItem("daltonismType")

  // Redirect safety check
  if (!user || !daltonismType) {
    window.location.href = "./auth/login.html"
    return
  }

  // Render user info
  const container = document.getElementById("userInfo")

  container.innerHTML = `
    <p><strong>Username:</strong> ${user.username}</p>
    <p><strong>Role:</strong> ${user.role}</p>
    <p><strong>Vision Type:</strong> ${daltonismType}</p>
  `

  // Navigation buttons
  document.getElementById("goCamera")
    .addEventListener("click", () => {
      window.location.href = "./camera.html"
    })

  document.getElementById("goQuiz")
    .addEventListener("click", () => {
      window.location.href = "./quiz.html"
    })

  document.getElementById("goChat")
    .addEventListener("click", () => {
      window.location.href = "./chat.html"
    })

  document.getElementById("goAchievements")
    .addEventListener("click", () => {
      window.location.href = "./achievements.html"
    })
}