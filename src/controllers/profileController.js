export function initProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser"))
  const type = localStorage.getItem("daltonismType")

  const userInfo = document.getElementById("userInfo")
  const goCamera = document.getElementById("goCamera")
  const goQuiz = document.getElementById("goQuiz")
  const goChat = document.getElementById("goChat")
  const goAchievements = document.getElementById("goAchievements")
  const overlay = document.getElementById("chatOverlay")

  if (!userInfo || !goCamera || !goQuiz || !goChat || !goAchievements || !overlay) return
  if (!user || !type) return

  userInfo.innerHTML = `
    <p><strong>Username:</strong> ${user.username}</p>
    <p><strong>Role:</strong> ${user.role}</p>
    <p><strong>Vision:</strong> ${type}</p>
  `

  goCamera.onclick = () => { window.location.href = "./camera.html" }
  goQuiz.onclick = () => { window.location.href = "./quiz.html" }
  goAchievements.onclick = () => { window.location.href = "./achievements.html" }

  goChat.onclick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    overlay.classList.toggle("hidden")
  }

  overlay.addEventListener("click", (e) => {
    e.stopPropagation()
  })
}