const API_URL = "http://localhost:3000/messages"

export async function getMessages() {
  try {
    const res = await fetch(API_URL)
    return await res.json()
  } catch (err) {
    console.error("GET messages failed:", err)
    return []
  }
}

export async function sendMessage(message) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    })

    if (!res.ok) {
      console.error("POST failed:", res.status)
    }

    return await res.json()
  } catch (err) {
    console.error("SEND message failed:", err)
    return null
  }
}