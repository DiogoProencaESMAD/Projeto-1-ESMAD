# Huebly

Huebly is a university accessibility web app designed to help people with color blindness. It combines a simple onboarding flow, app-wide color themes, a camera-based color helper, a quiz system, achievements, and profile customization.

## Main Features

- Account registration and login
- First-time onboarding with manual vision type selection or a daltonism test
- App-wide themes based on vision type, with manual scheme override in settings
- Camera page for color-related assistance
- Quiz system with 100 questions and 10 random non-repeated questions per run
- XP, levels, and achievements
- Profile customization with preset avatars
- Simple in-app chat overlay

## Tech Stack

- HTML
- CSS
- JavaScript modules
- `json-server` for local mock persistence
- `python3 -m http.server` for the frontend

## Project Structure

- `src/views/` contains the HTML pages
- `src/controllers/` contains page logic and UI flow
- `src/models/` contains user, quiz, and achievement data logic
- `src/services/` contains API-facing logic
- `src/shared/` contains shared components, constants, and utilities
- `public/data/` contains the quiz question bank
- `backend/db.json` stores users, achievements, chat messages, and other persisted data

## How To Run

Install dependencies once:

```bash
npm install
```

Start the JSON Server API on port `3000`:

```bash
npm run api
```

In a second terminal, start the frontend on port `8000`:

```bash
npm start
```

Open the app in the browser:

```text
http://localhost:8000/
```

## Manual Setup

If you prefer not to use the npm scripts:

```bash
python3 -m http.server 8000
json-server --watch backend/db.json --port 3000
```

## Important Notes

- `http://localhost:8000/` serves the frontend.
- `http://localhost:3000/` serves the JSON Server API.
- The browser stores only the `authToken`; the rest of the data is persisted in `backend/db.json`.
- New users are sent to onboarding after registration to choose a vision type or run the daltonism test.
- Returning users with a saved vision type go directly to the profile page.
- Changing the vision type inside the app resets the color scheme back to automatic for that vision type.

## Suggested Demo Flow

1. Create a new account.
2. Show the onboarding flow and pick a vision type or run the daltonism test.
3. Open the profile page and show the saved vision type, theme, and avatar options.
4. Open settings and change the username, avatar, or color scheme.
5. Start a quiz and show that it loads 10 random questions from the 100-question bank.
6. Finish the quiz and show XP, level, and achievement progress.
7. Open the achievements page to show locked vs unlocked achievements.
8. Open the camera page and show the themed UI and color helper features.

## Future Improvements

- Add more advanced accessibility guidance and educational content
- Improve the camera and color-detection accuracy
- Add more onboarding explanations and result details for the daltonism test
