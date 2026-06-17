import { API_BASE } from "../shared/constants/api.js"

export async function getMessages() {
  const res = await fetch(`${API_BASE}/messages`)
  if (!res.ok) {
    return []
  }
  return res.json()
}

export async function sendMessage(message) {
  const res = await fetch(`${API_BASE}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  })

  if (!res.ok) {
    throw new Error("Unable to send message")
  }

  return res.json()
}
