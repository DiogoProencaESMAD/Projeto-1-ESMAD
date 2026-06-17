export const DALTONISM_TEST_QUESTIONS = [
  {
    id: "control",
    number: "12",
    choices: ["12", "8", "3"],
    correct: "12",
    backgroundColors: ["#d8b36c", "#d7a85a", "#c89a49"],
    foregroundColors: ["#678b58", "#587a47", "#7d9d6f"],
    scores: {
      "12": { normal: 1, protanopia: 1, deuteranopia: 1, tritanopia: 1 },
      none: { monochromacy: 2 },
      unknown: {}
    }
  },
  {
    id: "red-green-1",
    number: "8",
    choices: ["8", "3", "5"],
    correct: "8",
    backgroundColors: ["#b1a05a", "#bfaa67", "#cab56e"],
    foregroundColors: ["#d66b5a", "#d05e55", "#dc776a"],
    scores: {
      "8": { normal: 2 },
      "3": { protanopia: 2, deuteranopia: 2 },
      "5": { protanopia: 1, deuteranopia: 1 },
      none: { protanopia: 2, deuteranopia: 2, monochromacy: 1 },
      unknown: {}
    }
  },
  {
    id: "red-green-2",
    number: "29",
    choices: ["29", "70", "45"],
    correct: "29",
    backgroundColors: ["#84a05a", "#75944d", "#6f8f4a"],
    foregroundColors: ["#d17b64", "#cb6d5b", "#db8870"],
    scores: {
      "29": { normal: 2 },
      "70": { protanopia: 2, deuteranopia: 2 },
      "45": { protanopia: 1, deuteranopia: 1 },
      none: { protanopia: 1, deuteranopia: 1, monochromacy: 1 },
      unknown: {}
    }
  },
  {
    id: "blue-yellow",
    number: "5",
    choices: ["5", "2", "8"],
    correct: "5",
    backgroundColors: ["#6a8db4", "#709ac3", "#7aa7cc"],
    foregroundColors: ["#d1c86a", "#d8d073", "#c4bb61"],
    scores: {
      "5": { normal: 2 },
      "2": { tritanopia: 3 },
      "8": { tritanopia: 1 },
      none: { tritanopia: 2, monochromacy: 1 },
      unknown: {}
    }
  },
  {
    id: "low-contrast",
    number: "45",
    choices: ["45", "15", "96"],
    correct: "45",
    backgroundColors: ["#a1a1a1", "#adadad", "#b8b8b8"],
    foregroundColors: ["#6e6e6e", "#636363", "#777777"],
    scores: {
      "45": { normal: 1 },
      "15": { monochromacy: 1 },
      "96": { monochromacy: 1 },
      none: { monochromacy: 3 },
      unknown: {}
    }
  }
]
