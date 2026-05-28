import {
  getMessages,
  sendMessage
} from "../services/chatService.js"

export function initChat() {
  const input = document.getElementById("chatInput")
  const sendBtn = document.getElementById("sendChat")
  const container = document.getElementById("chatMessages")

  async function render() {
    const messages = await getMessages()

    container.innerHTML = messages
      .map(
        m => `<p><strong>${m.user}:</strong> ${m.text}</p>`
      )
      .join("")
  }

  sendBtn.addEventListener("click", async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"))
    const text = input.value.trim()

    if (!text) return

    await sendMessage({
      user: user.username,
      text
    })

    input.value = ""
    render()
  })

  // auto refresh (fake real-time)
  setInterval(render, 2000)

  render()
}