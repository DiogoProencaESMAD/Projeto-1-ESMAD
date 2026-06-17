import {
  loginUser,
  registerUser
} from "../services/authService.js"

function redirectAfterLogin(user) {
  if (user.daltonismType) {
    window.location.href = "../profile.html"
  } else {
    window.location.href = "../onboarding/select-daltonism.html"
  }
}

export function initLogin() {
  const form = document.getElementById("loginForm")
  if (!form) return

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("username")?.value
    const password = document.getElementById("password")?.value

    const result = await loginUser(username, password)

    if (result.success) {
      redirectAfterLogin(result.user)
    } else {
      alert(result.message)
    }
  })
}

export function initRegister() {
  const form = document.getElementById("registerForm")
  if (!form) return

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("registerUsername")?.value
    const password = document.getElementById("registerPassword")?.value

    const result = await registerUser(username, password)

    if (result.success) {
      alert("Account created. Please choose your vision type or run the test.")
      window.location.href = "../onboarding/select-daltonism.html"
    } else {
      alert(result.message)
    }
  })
}

export function registerLinkHandler() {
  const registerLink = document.getElementById("registerLink")

  registerLink.addEventListener("click", () => {

    window.location.href =
      "./register.html"
  })
}

export function loginLinkHandler() {

  const loginLink = document.getElementById("loginLink")

  loginLink.addEventListener("click", () => {
    window.location.href =
      "./login.html"
  })
}

export function initPasswordToggle(inputId, toggleId) {

  const passwordInput = document.getElementById(inputId)
  const passwordToggle = document.getElementById(toggleId)

  if (!passwordInput || !passwordToggle) return

  passwordToggle.addEventListener("click", () => {

    const isHidden = passwordInput.type === "password"

    passwordInput.type = isHidden ? "text" : "password"

    passwordToggle.innerHTML = `<i data-lucide="${isHidden ? 'eye-off' : 'eye'}"></i>`
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons()
    }

    passwordToggle.setAttribute(
      "aria-label",
      isHidden ? "Hide password" : "Show password"
    )
  })
}
