const API_URL = "http://localhost:3000/messages"

export async function getMessages() {
  const res = await fetch(API_URL)
  return await res.json()
}

export async function sendMessage(message) {
  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  })
}