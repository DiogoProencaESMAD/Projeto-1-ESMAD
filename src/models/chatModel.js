export function createMessage(user, text) {
  return {
    user,
    text,
    timestamp: new Date().toISOString()
  }
}