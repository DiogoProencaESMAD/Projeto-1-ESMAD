import { getMessages, sendMessage } from "../../services/chatService.js"
import { createMessage } from "../../models/chatModel.js"
import { getCurrentUser } from "../../models/userModel.js"
import { escapeHtml } from "../utils/dom.js"

export function initChatOverlay() {
  const overlay = document.getElementById("chatOverlay")
  const goChat = document.getElementById("goChat")

  if (!overlay || !goChat) {
    return
  }

  overlay.innerHTML = `
    <div id="chatMessages" class="chat-messages"></div>
    <input id="chatInput" type="text" autocomplete="off" placeholder="Write a message..." />
    <button id="sendChat" type="button">Send</button>
    <div id="chatStatus" class="chat-status"></div>
  `

  const input = overlay.querySelector("#chatInput")
  const sendBtn = overlay.querySelector("#sendChat")
  const container = overlay.querySelector("#chatMessages")
  const statusEl = overlay.querySelector("#chatStatus")

  async function render() {
    try {
      const user = await getCurrentUser()

      if (!user) {
        statusEl.textContent = "Please log in before sending messages."
        sendBtn.disabled = true
        input.disabled = true
        container.innerHTML = ""
        return
      }

      const messages = await getMessages()
      container.innerHTML = messages
        .map(
          (m) =>
            `<p><strong>${escapeHtml(m.user)}:</strong> ${escapeHtml(m.text)}</p>`
        )
        .join("")
      container.scrollTop = container.scrollHeight
      statusEl.textContent = `Chat loaded (${messages.length} messages)`
      sendBtn.disabled = false
      input.disabled = false
    } catch (err) {
      console.error("Render error:", err)
      statusEl.textContent = "Error loading chat: " + err.message
    }
  }

  async function handleSend(e) {
    e.preventDefault()
    e.stopPropagation()

    const user = await getCurrentUser()
    const text = input.value.trim()
    if (!text || !user) {
      statusEl.textContent = "Please enter a message"
      return
    }

    try {
      statusEl.textContent = "Sending..."
      const message = createMessage(user.username, text)
      await sendMessage(message)
      input.value = ""
      statusEl.textContent = "Message sent"
      await render()
    } catch (err) {
      console.error("Send failed:", err)
      statusEl.textContent = "Error: " + err.message
    }
  }

  sendBtn.addEventListener("click", handleSend)

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSend(e)
    }
  })

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
