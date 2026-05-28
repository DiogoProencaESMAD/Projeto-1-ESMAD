export function initDaltonism() {
  const form = document.getElementById("daltonismForm")

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const type = document.getElementById("daltonismType").value

    // store global vision state
    localStorage.setItem("daltonismType", type)

    // next step
    window.location.href = "../profile.html"
  })
}