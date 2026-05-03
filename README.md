# BatiFlow

Monorepo for the BatiFlow product: an **Expo (React Native)** mobile app and a **NestJS** API backed by **MongoDB**. Email verification uses **Resend**; Google/Apple sign-in uses **Firebase Auth** on the client and **Firebase Admin** on the API.

This repository is intended to be published as **one public GitHub repo** containing both `frontend/` and `core/`.

## Security and secrets

- **Never commit** real API keys, JWT secrets, OTP peppers, or Firebase private keys. Use `.env` locally (gitignored) and secret managers in production.
- **Resend:** If an API key was ever exposed in chat, issues, or commits, **rotate it immediately** in the [Resend dashboard](https://resend.com/docs/dashboard/api-keys/introduction) and update deployment secrets only—do not put live keys in `.env.example` or documentation.
- **JWT / OTP:** Treat `JWT_SECRET` and `OTP_PEPPER` like passwords—long random values, unique per environment.

## Prerequisites

| Requirement | Notes |
| ----------- | ----- |
| **Node.js** | LTS (e.g. 20.x) for `core` and `frontend` |
| **MongoDB** | Local or hosted instance; URI in `core/.env` |
| **Expo CLI** | Use `npx expo` via project scripts; **Expo Go** or a dev build for devices |
| **Firebase project** | For client config + Admin SDK on the API (see [Firebase setup](#firebase-setup) below) |
| **Resend account** | Verified sending domain (or Resend sandbox) for registration OTP emails in non-dev environments |

## Repository layout

| Path | Description |
| ---- | ----------- |
| [`frontend/`](frontend/) | Expo ~54 app (Expo Router, NativeWind) |
| [`core/`](core/) | NestJS 11 API |

## Run locally

### 1. API (`core`)

```bash
cd core
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET (≥16 chars), OTP_PEPPER (≥16 chars), etc.

npm install
npm run start:dev
```

Default HTTP port is **3000** (override with `PORT` in `.env`).

### 2. Mobile app (`frontend`)

```bash
cd frontend
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to the API base URL.
# On a physical device, use your machine's LAN IP (e.g. http://192.168.1.10:3000), not 127.0.0.1.

npm install
npx expo start
```

Expo dev server URLs (`exp://`, `http://localhost:8081`, etc.) must be able to reach the API host you configure.

## Environment variables

Authoritative placeholders live in:

- [`core/.env.example`](core/.env.example)
- [`frontend/.env.example`](frontend/.env.example)

### API (`core`)

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `PORT` | No (default `3000`) | HTTP port |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes (min 16 chars) | Signing key for access tokens |
| `JWT_EXPIRES_IN` | No | JWT lifetime (e.g. `7d`) |
| `OTP_PEPPER` | Yes (min 16 chars) | Server-side secret mixed into OTP hashing |
| `OTP_TTL_MINUTES` | No | OTP validity window |
| `OTP_MAX_SENDS_PER_HOUR` | No | Rate limit for resend |
| `OTP_MAX_ATTEMPTS` | No | Max verification attempts per challenge |
| `RESEND_API_KEY` | For real email | Empty in local dev: OTP may be logged instead of sent |
| `RESEND_FROM_EMAIL` | When key set | Verified sender (e.g. `notifications@yourdomain.com`) |
| `FIREBASE_PROJECT_ID` | For `POST /auth/firebase` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | For `POST /auth/firebase` | Service account email |
| `FIREBASE_PRIVATE_KEY` | For `POST /auth/firebase` | Service account private key (`\n` for newlines in `.env`) |

### Mobile (`frontend`)

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `EXPO_PUBLIC_API_URL` | Yes | Nest API base URL (no trailing slash) |
| `EXPO_PUBLIC_FIREBASE_*` | Yes (for Firebase Auth) | Web app config from Firebase console |
| `EXPO_PUBLIC_GOOGLE_*_CLIENT_ID` | For Google sign-in | Web / iOS / Android OAuth client IDs |

## Firebase setup

Use one Firebase project for both the app and Admin verification.

1. **Create a project** in the [Firebase console](https://console.firebase.google.com/).
2. **Register apps**
   - Add an **iOS** app: set **Bundle ID** to match Xcode / `app.json` / EAS (must match what you ship).
   - Add an **Android** app: set **applicationId** / package name to match your Gradle / Expo config.
   - Add a **Web** app: copy the `firebaseConfig` values into `EXPO_PUBLIC_FIREBASE_*` in `frontend/.env`.
3. **Authentication**
   - Enable **Email/Password** (and any social providers you use).
   - For **Google**: in Google Cloud Console (linked from Firebase), create OAuth clients for **Web**, **iOS**, and **Android**; add **SHA-1** (and SHA-256 for some flows) for the Android keystore you use for debug/release; paste client IDs into `frontend/.env`.
   - For **Apple**: enable Sign in with Apple on the Apple Developer account, configure the Firebase Apple provider, and follow Expo’s `expo-apple-authentication` setup for your bundle ID / service ID.
4. **Service account (API)**
   - Firebase console → Project settings → **Service accounts** → generate a new private key (JSON).
   - Map `project_id`, `client_email`, and `private_key` to `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in `core/.env` (see comments in `.env.example` for multiline key formatting).
5. **Native config files**
   - **iOS:** Add `GoogleService-Info.plist` per Expo/Firebase docs (e.g. EAS or `app.json` plugins).
   - **Android:** Add `google-services.json` in the path expected by your build (Expo prebuild / Gradle).

## Resend setup

1. Create an account at [Resend](https://resend.com/) and verify your **sending domain** (or use their test domain for development only).
2. Create an **API key**; store it only in `core/.env` or your host’s secrets—**not** in the repo.
3. Set `RESEND_FROM_EMAIL` to an address on a domain you have verified in Resend.
4. For local development you may leave `RESEND_API_KEY` empty if the API logs OTPs instead of sending (confirm behavior in your environment).

## License

See individual packages for license terms if specified.
