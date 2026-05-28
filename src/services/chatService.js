const CHAT_KEY = "messages"

export function getMessages() {
  return JSON.parse(localStorage.getItem(CHAT_KEY)) || []
}

export function saveMessages(messages) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(messages))
}