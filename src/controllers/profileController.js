export function initProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser"))
  const daltonismType = localStorage.getItem("daltonismType")

  if (!user || !daltonismType) {
    window.location.href = "./auth/login.html"
    return
  }

  document.getElementById("userInfo").innerHTML = `
    <p><strong>Username:</strong> ${user.username}</p>
    <p><strong>Role:</strong> ${user.role}</p>
    <p><strong>Vision Type:</strong> ${daltonismType}</p>
  `

  document.getElementById("goCamera").addEventListener("click", () => {
    window.location.href = "./camera.html"
  })

  document.getElementById("goQuiz").addEventListener("click", () => {
    window.location.href = "./quiz.html"
  })

  document.getElementById("goAchievements").addEventListener("click", () => {
    window.location.href = "./achievements.html"
  })

  // CHAT TOGGLE (IMPORTANT)
  document.getElementById("goChat").addEventListener("click", () => {
    const overlay = document.getElementById("chatOverlay")
    overlay.classList.toggle("hidden")
  })
}