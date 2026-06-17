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

  // Prevent multiple initializations when controllers call this multiple times
  if (overlay.dataset.chatInitialized === "true") {
    return
  }
  overlay.dataset.chatInitialized = "true"

  overlay.innerHTML = `
  <div
    id="forumOverlay"
    class="theme-chat-panel w-full rounded-t-3xl p-4 shadow-xl flex flex-col overflow-hidden max-h-80"
  > 
    <div id="chatMessages" class="theme-chat-surface flex-1 mb-2 rounded-xl p-3 overflow-y-auto"></div>
    <div class="relative">
            <input
                type="text"
                id="chatInput"
                placeholder="Escreve uma mensagem..."
                class="theme-chat-input w-full h-12 px-4 text-base font-medium outline-none border rounded-lg"
            >
            <button
                id="sendChat"
                type="button"
                aria-label="Enviar mensagem"
                class="theme-chat-send absolute right-3 top-1/2 -translate-y-1/2 transition"
            >
                <i data-lucide="send" class="w-5 h-5"></i>
            </button>
        </div>
    <div id="chatStatus" class="theme-chat-status hidden mt-2 text-sm"></div>
  </div>
  `

  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons()
  }

  const input = overlay.querySelector("#chatInput")
  const sendBtn = overlay.querySelector("#sendChat")
  const container = overlay.querySelector("#chatMessages")
  const statusEl = overlay.querySelector("#chatStatus")

  function setStatus(message, isVisible = true) {
    if (!statusEl) return
    statusEl.textContent = message
    statusEl.classList.toggle("hidden", !isVisible || !message)
  }

  async function render() {
    try {
      const user = await getCurrentUser()

      if (!user) {
        setStatus("Please log in before sending messages.")
        if (sendBtn) sendBtn.disabled = true
        if (input) input.disabled = true
        if (container) container.innerHTML = ""
        return
      }

      let messagesRes = await getMessages()
      let messages = []
      if (Array.isArray(messagesRes)) {
        messages = messagesRes
      } else if (messagesRes && Array.isArray(messagesRes.data)) {
        messages = messagesRes.data
      }

      if (!container) return

      if (messages.length === 0) {
        container.innerHTML = `<div class="theme-muted-text text-sm">Sem mensagens ainda.</div>`
      } else {
        container.innerHTML = messages
          .map(
            (m) => `
          <div class="theme-chat-message flex gap-2 mb-2">
            <span class="theme-chat-user font-semibold text-lg shrink-0">
                ${escapeHtml(m.user)}
            </span>
            <p class="theme-chat-message text-base">
                ${escapeHtml(m.text)}
            </p>
          </div>
        `
          )
          .join("")
      }

      container.scrollTop = container.scrollHeight
      setStatus(`Chat loaded (${messages.length} messages)`)
      if (sendBtn) sendBtn.disabled = false
      if (input) input.disabled = false
    } catch (err) {
      console.error("Render error:", err)
      setStatus("Error loading chat: " + (err && err.message ? err.message : String(err)))
    }
  }

  async function handleSend(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
      e.stopPropagation()
    }

    const user = await getCurrentUser()
    const text = input ? String(input.value || "").trim() : ""
    if (!text || !user) {
      setStatus("Please enter a message")
      return
    }

    try {
      setStatus("Sending...")
      const message = createMessage(user.username, text)
      await sendMessage(message)
      if (input) input.value = ""
      setStatus("Message sent")
      await render()
    } catch (err) {
      console.error("Send failed:", err)
      setStatus("Error: " + (err && err.message ? err.message : String(err)))
    }
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", handleSend)
  }

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleSend(e)
      }
    })
  }

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
