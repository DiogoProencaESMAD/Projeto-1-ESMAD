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
  if (!body) return

  Object.values(DALTONISM_THEMES).forEach((themeClass) => {
    body.classList.remove(themeClass)
  })

  body.classList.remove("mode-light", "mode-dark")
  body.classList.add(getDaltonismTheme(resolveThemeType(typeOrUser, explicitScheme)))
  body.classList.add(`mode-${resolveDisplayMode(typeOrUser)}`)
}
