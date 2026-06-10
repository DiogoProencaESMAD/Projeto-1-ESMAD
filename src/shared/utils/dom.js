export function escapeHtml(text) {
  const el = document.createElement("span")
  el.textContent = String(text ?? "")
  return el.innerHTML
}
