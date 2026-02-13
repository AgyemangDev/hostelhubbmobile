<!-- Copilot / AI agent instructions for Hostelhubb mobile app -->

# Hostelhubb — Copilot instructions

Purpose: Give AI coding agents the minimal, actionable knowledge to be productive in this repo.

- Big picture
  - Expo-managed React Native app using `expo-router` (entry: `expo-router/entry` in package.json).
  - App routes live under the `app/` folder and use route groups (example: `(tabs)`, `(Client)`, `(Details)`).
  - Global state is provided via React Contexts in `context/` (e.g. `UserContext.jsx`, `ProductContext.jsx`).
  - UI components live in `components/`; utilities and platform integrations live in `utils/` and `services/`.

- Key integration points
  - Firebase + Firebase Auth: see `app/firebase/FirebaseConfig` and usage in `context/UserContext.jsx`.
  - Supabase referenced in `package.json` (used in some utils/services).
  - Server API base: `utils/api/api.js` (used by `context` and `utils` for fetches).
  - SSE: server-sent events via `react-native-sse` in `context/UserContext.jsx`.
  - OTA and builds: `eas` is used for builds and updates (examples in `README.md`).

- Dev & build workflows (commands)
  - Install deps: `npm install` or `yarn`.
  - Start dev server: `npm start` (runs `expo start`) or `npx expo start`.
  - Run on device/emulator: `npm run ios` (`expo run:ios`) or `npm run android` (`expo run:android`).
  - Production builds: use `eas build --platform ios|android` and OTA: `eas update --branch production --message "<msg>"`.
  - Tests: `npm test` runs `jest --watchAll` (uses `jest-expo`).

- Project-specific patterns & conventions
  - Routing: use the `app/` filesystem routes. Example layout file: [app/(tabs)/(Hubclipps)/_layout.jsx](app/(tabs)/(Hubclipps)/_layout.jsx).
  - Navigation helpers: `components/MainLayout.jsx` centralizes routing and deep-link handling. See [components/MainLayout.jsx](components/MainLayout.jsx).
  - Deep linking: implemented in `utils/deepLinking.js`. Prefer using `handleDeepLinking` and `setupDeepLinkListeners` helpers.
  - Auth flow: `utils/authentication.js` contains `checkUserAuthState` used by `MainLayout` to route users.
  - State and side-effects: contexts may open long-lived SSE connections — prefer re-use and safe teardown (see `context/UserContext.jsx`).
  - Naming: components are `.jsx`/`.tsx`; contexts are suffixed with `Context.jsx`. Keep providers in `context/`.

- Safety and common gotchas
  - Tokens: contexts use `firebaseUser.getIdToken(false)` to avoid force refresh quota issues — preserve that approach.
  - SSE reconnect/backoff: `UserContext` contains reconnection logic; changes here affect battery/network behavior.
  - Build numbers: README warns about manually changing version/build numbers for releases — follow existing release notes.

- Where to look first (examples)
  - Routing & layout: [components/MainLayout.jsx](components/MainLayout.jsx)
  - Deep linking: [utils/deepLinking.js](utils/deepLinking.js)
  - Auth check: [utils/authentication.js](utils/authentication.js)
  - User session + SSE: [context/UserContext.jsx](context/UserContext.jsx)
  - Package scripts & deps: [package.json](package.json)

If anything above is unclear or you need more examples (e.g., how to add a new Context or route), ask and I'll expand the file with step-by-step examples.
