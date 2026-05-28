import {
  loginUser,
  registerUser
} from "../services/authService.js"

export function initLogin() {
  const form =
    document.getElementById("loginForm")

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const username =
      document.getElementById("username").value

    const password =
      document.getElementById("password").value

    const result = loginUser(
      username,
      password
    )

    if (result.success) {
      window.location.href =
        "../onboarding/select-daltonism.html"
    } else {
      alert(result.message)
    }
  })
}

export function initRegister() {
  const form =
    document.getElementById("registerForm")

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const username =
      document.getElementById(
        "registerUsername"
      ).value

    const password =
      document.getElementById(
        "registerPassword"
      ).value

    const role =
      document.getElementById("role").value

    const result = registerUser(
      username,
      password,
      role
    )

    if (result.success) {
      alert("Account created")

      window.location.href =
        "./login.html"
    } else {
      alert(result.message)
    }
  })
}