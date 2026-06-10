export const DALTONISM_LABELS = {
  normal: "Normal vision",
  protanopia: "Protanopia",
  deuteranopia: "Deuteranopia",
  tritanopia: "Tritanopia",
  monochromacy: "Monochromacy"
}

export const DALTONISM_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "protanopia", label: "Protanopia" },
  { value: "deuteranopia", label: "Deuteranopia" },
  { value: "tritanopia", label: "Tritanopia" },
  { value: "monochromacy", label: "Monochromacy" },
  { value: "take-test", label: "Take a daltonism test" }
]

export const DALTONISM_THEMES = {
  normal: "theme-normal",
  protanopia: "theme-protanopia",
  deuteranopia: "theme-deuteranopia",
  tritanopia: "theme-tritanopia",
  monochromacy: "theme-monochromacy"
}

export const COLOR_SCHEME_LABELS = {
  auto: "Auto (from vision type)",
  normal: "Blue",
  protanopia: "Indigo",
  deuteranopia: "Warm",
  tritanopia: "Teal",
  monochromacy: "Gray"
}

export const COLOR_SCHEME_OPTIONS = [
  { value: "auto", label: "Auto (from vision type)" },
  { value: "normal", label: "Blue" },
  { value: "protanopia", label: "Indigo" },
  { value: "deuteranopia", label: "Warm" },
  { value: "tritanopia", label: "Teal" },
  { value: "monochromacy", label: "Gray" }
]

export const DISPLAY_MODE_LABELS = {
  light: "Light",
  dark: "Dark"
}

export const DISPLAY_MODE_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" }
]

export function formatDaltonismType(type) {
  return DALTONISM_LABELS[type] || type || "Not set"
}

export function getDaltonismTheme(type) {
  return DALTONISM_THEMES[type] || DALTONISM_THEMES.normal
}

export function formatColorScheme(scheme) {
  return COLOR_SCHEME_LABELS[scheme] || COLOR_SCHEME_LABELS.auto
}

export function formatDisplayMode(mode) {
  return DISPLAY_MODE_LABELS[mode] || DISPLAY_MODE_LABELS.light
}
