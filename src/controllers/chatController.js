import { getMessages, saveMessages } from "../services/chatService.js"

export function initChat() {
  const input = document.getElementById("chatInput")
  const sendBtn = document.getElementById("sendChat")
  const closeBtn = document.getElementById("closeChat")
  const container = document.getElementById("chatMessages")

  if (!input || !sendBtn || !container) return

  function renderMessages() {
    const messages = getMessages()

    container.innerHTML = messages
      .map(
        m => `<p><strong>${m.user}:</strong> ${m.text}</p>`
      )
      .join("")
  }

  sendBtn.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"))
    const text = input.value.trim()

    if (!text) return

    const messages = getMessages()

    messages.push({
      user: user.username,
      text
    })

    saveMessages(messages)

    input.value = ""
    renderMessages()
  })

  closeBtn.addEventListener("click", () => {
    document.getElementById("chatOverlay").classList.add("hidden")
  })

  // initial render
  renderMessages()
}