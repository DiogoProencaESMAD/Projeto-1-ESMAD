import { getMessages, saveMessages } from "../services/chatService.js"

export function initChat() {
  const input = document.getElementById("chatInput")
  const sendBtn = document.getElementById("sendChat")
  const closeBtn = document.getElementById("closeChat")
  const overlay = document.getElementById("chatOverlay")
  const container = document.getElementById("chatMessages")

  if (!input || !sendBtn || !closeBtn || !overlay || !container) return

  async function render() {
    const messages = getMessages()

    container.innerHTML = messages
      .map(m => `<p><strong>${m.user}:</strong> ${m.text}</p>`)
      .join("")
  }

  sendBtn.addEventListener("click", async (e) => {
    e.preventDefault()

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

    await render()

    // FORCE KEEP OVERLAY OPEN (safety line)
    overlay.classList.remove("hidden")
  })

  closeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden")
  })

  render()
}