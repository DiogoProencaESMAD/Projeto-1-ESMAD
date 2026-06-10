import { initChatOverlay } from "../shared/components/chatOverlay.js"
import { getUser } from "../models/userModel.js"
import { applyDaltonismTheme } from "../shared/utils/theme.js"

export async function initCamera() {
  const user = await getUser()
  if (!user) {
    window.location.href = "./auth/login.html"
    return
  }

  applyDaltonismTheme(user)
  initChatOverlay()

  const video = document.getElementById("video")
  const canvas = document.getElementById("canvas")
  const swatch = document.getElementById("swatch")
  const nameEl = document.getElementById("color-name")
  const metaEl = document.getElementById("color-meta")
  const statusEl = document.getElementById("status")
  const btn = document.getElementById("freezeBtn")

  if (!video || !canvas || !swatch || !nameEl || !metaEl || !statusEl || !btn) {
    console.error("Camera page elements not found")
    return
  }

  const ctx = canvas.getContext("2d")
  let stream = null
  let frozen = false
  let lastHex = ""
  let stable = 0

  async function startCamera() {
    const constraints = [
      { video: { facingMode: "environment" } },
      { video: true }
    ]

    for (const constraint of constraints) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraint)
        video.srcObject = stream
        return
      } catch {
        // try next constraint
      }
    }

    statusEl.textContent = "Camera error: unable to access camera"
  }

  startCamera()

  video.addEventListener("loadeddata", () => {
    canvas.width = video.videoWidth * 0.25
    canvas.height = video.videoHeight * 0.25
    loop()
  })

  function rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((v) => Math.round(v).toString(16).padStart(2, "0"))
        .join("")
    )
  }

  function sample() {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let r = 0
    let g = 0
    let b = 0
    let count = 0

    for (let i = 0; i < data.length; i += 16) {
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      count++
    }

    return [r / count, g / count, b / count]
  }

  function loop() {
    if (!frozen && video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const [r, g, b] = sample()
      const hex = rgbToHex(r, g, b)

      if (hex === lastHex) stable++
      else {
        lastHex = hex
        stable = 0
      }

      if (stable > 2 && window.ntc) {
        const result = window.ntc.name(hex)

        swatch.style.background = hex
        nameEl.textContent = result[1]
        metaEl.textContent = hex
        statusEl.textContent = "Stable"
      }
    }

    requestAnimationFrame(loop)
  }

  btn.addEventListener("click", () => {
    frozen = !frozen
    btn.textContent = frozen ? "Resume" : "Freeze"
  })

  window.addEventListener("pagehide", () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
  })
}
