import { getMessages, sendMessage } from "../../services/chatService.js"
import { createMessage } from "../../models/chatModel.js"

export function initChatOverlay() {
  const overlay = document.getElementById("chatOverlay")
  const goChat = document.getElementById("goChat")

  if (!overlay || !goChat) return

  // Inject the chat HTML into the overlay
  overlay.innerHTML = `
    <div id="chatMessages" style="height:200px; overflow:auto; border:1px solid #ccc;"></div>
    <input id="chatInput" type="text" autocomplete="off" />
    <button id="sendChat" type="button">Send</button>
  `

  const input = overlay.querySelector("#chatInput")
  const sendBtn = overlay.querySelector("#sendChat")
  const container = overlay.querySelector("#chatMessages")

  async function render() {
    const messages = await getMessages()
    container.innerHTML = messages
      .map(m => `<p><strong>${m.user}:</strong> ${m.text}</p>`)
      .join("")
    container.scrollTop = container.scrollHeight
  }

  async function handleSend(e) {
    e.preventDefault()
    e.stopPropagation()

    const user = JSON.parse(localStorage.getItem("currentUser"))
    const text = input.value.trim()
    if (!text || !user) return

    try {
      const message = createMessage(user.username, text)
      await sendMessage(message)
      input.value = ""
      await render()
    } catch (err) {
      console.error("Send failed:", err)
    }
  }

  sendBtn.addEventListener("click", handleSend)

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSend(e)
    }
  })

  // Stop clicks inside overlay from bubbling up
  overlay.addEventListener("click", (e) => {
    e.stopPropagation()
  })

  goChat.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    overlay.classList.toggle("hidden")
    if (!overlay.classList.contains("hidden")) {
      render()
    }
  })
}