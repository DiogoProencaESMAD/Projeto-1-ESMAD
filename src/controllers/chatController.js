import { getMessages, sendMessage } from "../services/chatService.js"

export function initChat() {
  const input = document.getElementById("chatInput")
  const sendBtn = document.getElementById("sendChat")
  const container = document.getElementById("chatMessages")

  if (!input || !sendBtn || !container) return

  async function render() {
    const messages = await getMessages()
    container.innerHTML = messages
      .map(m => `<p><strong>${m.user}:</strong> ${m.text}</p>`)
      .join("")
  }

  async function handleSend(e) {
    e.preventDefault()
    e.stopPropagation()

    const user = JSON.parse(localStorage.getItem("currentUser"))
    const text = input.value.trim()
    if (!text || !user) return

    try {
      await sendMessage({ user: user.username, text })
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

  render()
}