import { DALTONISM_THEMES, getDaltonismTheme } from "../constants/daltonism.js"

export function resolveThemeType(typeOrUser, explicitScheme) {
  if (typeof typeOrUser === "object" && typeOrUser !== null) {
    const colorScheme = typeOrUser.colorScheme || "auto"
    return colorScheme !== "auto"
      ? colorScheme
      : typeOrUser.daltonismType || "normal"
  }

  if (explicitScheme && explicitScheme !== "auto") {
    return explicitScheme
  }

  return typeOrUser || "normal"
}

export function resolveDisplayMode(typeOrUser, explicitMode) {
  if (typeof typeOrUser === "object" && typeOrUser !== null) {
    return typeOrUser.displayMode || "light"
  }

  return explicitMode || "light"
}

export function applyDaltonismTheme(typeOrUser, explicitScheme) {
  const body = document.body
  const root = document.documentElement
  if (!body || !root) return

  Object.values(DALTONISM_THEMES).forEach((themeClass) => {
    body.classList.remove(themeClass)
  })

  body.classList.remove("mode-light", "mode-dark", "dark")
  root.classList.remove("dark")

  const themeClass = getDaltonismTheme(resolveThemeType(typeOrUser, explicitScheme))
  body.classList.add(themeClass)

  const displayMode = resolveDisplayMode(typeOrUser)
  body.classList.add(`mode-${displayMode}`)

  try {
    localStorage.setItem("huebly:displayMode", displayMode)
  } catch {
    // Ignore storage errors so theming still works in restricted environments.
  }

  if (displayMode === "dark") {
    body.classList.add("dark")
    root.classList.add("dark")
  }
}
