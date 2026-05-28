export function createMessage(user, text) {
  return {
    id: Date.now(),
    user,
    text,
    timestamp: new Date().toISOString()
  }
}