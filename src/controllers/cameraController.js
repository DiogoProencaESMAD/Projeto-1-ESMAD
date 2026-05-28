export function initCamera() {
  const video = document.getElementById("video")
  const canvas = document.getElementById("canvas")
  const swatch = document.getElementById("swatch")
  const nameEl = document.getElementById("color-name")
  const metaEl = document.getElementById("color-meta")
  const statusEl = document.getElementById("status")
  const btn = document.getElementById("freezeBtn")

  const ctx = canvas.getContext("2d")

  let frozen = false
  let lastHex = ""
  let stable = 0

  // CAMERA START
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  })
  .then(stream => {
    video.srcObject = stream
  })
  .catch(err => {
    statusEl.textContent = "Camera error: " + err.message
  })

  video.addEventListener("loadeddata", () => {
    canvas.width = video.videoWidth * 0.25
    canvas.height = video.videoHeight * 0.25
    loop()
  })

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b]
      .map(v => Math.round(v).toString(16).padStart(2, "0"))
      .join("")
  }

  function sample() {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data

    let r = 0, g = 0, b = 0, count = 0

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

      if (stable > 2) {
        const result = window.ntc.name(hex)

        swatch.style.background = hex
        nameEl.textContent = result[1]
        metaEl.textContent = hex
        statusEl.textContent = "Stable"
      }
    }

    requestAnimationFrame(loop)
  }

  btn.onclick = () => {
    frozen = !frozen
    btn.textContent = frozen ? "Resume" : "Freeze"
  }
}