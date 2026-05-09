# BatiFlow

**BatiFlow** is a mobile-first appointment management system for teams that schedule client visits and follow-ups. It pairs a polished **Expo (React Native)** client with a **NestJS** API and **MongoDB**, with email verification powered by **Resend** and social sign-in through **Firebase Auth** (verified on the server with **Firebase Admin**).

This repository is a **monorepo**: the mobile app lives in [`frontend/`](frontend/) and the HTTP API in [`core/`](core/).

---

## Project overview

BatiFlow helps professionals **register securely**, **sign in with Google**, and **manage a calendar of appointments** from their phone. The app emphasizes a clear booking flow (client details → date → time slot), a **dashboard-style** appointments view, and **one-tap calling** so users can reach clients through the native dialer (`tel:` / `Linking`).

---

## Architecture

### Frontend: feature-based, layered structure

The Expo app organizes code **by capability** (auth, appointments, shared UI) and **by technical layer**:

| Layer | Role |
| ------- | ------ |
| **Routes (`app/`)** | Expo Router file-based screens; orchestrate navigation only. |
| **Feature UI (`components/`)** | Co-located presentational flows (e.g. `components/auth/`, `components/appointments/`). |
| **Hooks (`hooks/`)** | Mutations/queries per domain (`useLoginMutation`, `useAppointmentsQuery`, …). |
| **Services (`services/`)** | REST calls, Firebase, secure storage — thin adapters over HTTP and native APIs. |
| **Shared (`shared/`)** | Zod schemas, mappers, query keys, theme tokens — reusable contracts across features. |
| **Lib (`lib/`)** | Pure helpers (booking ISO dates, calendar theming, env wiring). |
| **Providers (`providers/`)** | TanStack Query, error boundaries, and app-wide context. |

This keeps features **easy to evolve** without cross-import spaghetti: routes stay thin, hooks own async state, and schemas stay centralized.

### Backend: NestJS modular monolith

The API in [`core/`](core/) follows Nest’s **module-per-domain** pattern:

- **`AuthModule`** — Registration, OTP email verification (**Resend**), login, password reset, **Firebase ID token** exchange for JWT issuance.
- **`AppointmentsModule`** — CRUD and slot queries scoped to the authenticated owner.
- **`UsersModule`** — Profile read/update (`/users/me`).
- **`FirebaseModule` / `DatabaseModule`** — Admin SDK bootstrap and Mongoose connection.
- **`Common`** — Exception filters and validation helpers.

Configuration is validated at startup (**Joi** via `env.validation.ts`), so misconfigured deployments fail fast instead of silently misbehaving.

---

## Tech stack

### Frontend

| Technology | Purpose |
| ---------- | ------- |
| **Expo (~54)** | Cross-platform runtime, dev client, and native modules. |
| **Expo Router** | File-based navigation and layouts. |
| **NativeWind (Tailwind)** | Utility-first styling on React Native. |
| **TanStack Query** | Server state, caching, and mutations. |
| **React Hook Form + Zod** | Forms with schema validation (`@hookform/resolvers`). |
| **Firebase Auth** | Email/password and OAuth (e.g. Google) on device. |
| **Axios** | HTTP client (see `frontend/api/`). |

### Backend

| Technology | Purpose |
| ---------- | ------- |
| **NestJS 11** | Modular HTTP API and DI container. |
| **MongoDB + Mongoose** | Document persistence for users and appointments. |
| **Passport JWT** | Bearer token verification on protected controllers. |
| **Firebase Admin SDK** | Validates Firebase **ID tokens** on `POST /auth/firebase`. |
| **Resend** | Transactional email (registration OTP; password-reset flows where configured). |
| **class-validator / class-transformer** | Request DTO validation. |

---

## Core features

- **Registration with email OTP** — Server sends verification codes via **Resend**; client confirms with `verify-email`. Rate limits and TTL are configurable (`OTP_*` env vars).
- **Google sign-in** — Firebase Auth on the client; **Firebase Admin** verifies `idToken` on the API, then issues a **JWT** for subsequent API calls.
- **Dashboard & appointments** — Calendar-oriented **rendez-vous** experience with list/detail patterns and mutations for confirm/create/update/delete as exposed by the API.
- **Booking flow** — Multi-step reservation: client info → date selection → slot selection.
- **Native dial pad integration** — Tapping phone actions opens the system composer via `tel:` URLs (`AppointmentCard`, day modal), with graceful fallbacks when calling is unavailable.

---

## Prerequisites

| Requirement | Notes |
| ----------- | ----- |
| **Node.js** | **LTS (e.g. 20.x)** recommended for both packages. |
| **MongoDB** | Local (`mongodb://127.0.0.1:27017/...`) or hosted URI. |
| **Expo tooling** | Use `npm` scripts / `npx expo`; physical devices need reachable API URLs (LAN IP vs `localhost`). |
| **Firebase project** | Web + native app config + service account JSON fields for Admin. |
| **Resend** | Verified sender domain for real OTP email in non-dev environments. |

---

## Installation & setup

### 1. Clone and install dependencies

From the repo root:

```bash
git clone https://github.com/<your-org>/BatiFlow.git
cd BatiFlow
```

#### Backend (`core/`)

```bash
cd core
cp .env.example .env
npm install
```

Edit **`core/.env`** with MongoDB, JWT/OTP secrets, optional Resend, and Firebase Admin fields (see [Environment variables template](#environment-variables-template)).

```bash
npm run start:dev
```

Default API port **`3000`** (override with `PORT`).

#### Frontend (`frontend/`)

```bash
cd ../frontend
cp .env.example .env
npm install
```

Set **`EXPO_PUBLIC_API_URL`** to your API base URL (no trailing slash):

- **iOS Simulator / same-machine web:** `http://127.0.0.1:3000` is fine.
- **Android Emulator:** Same host; this project can rewrite emulator loopback — see comments in `.env.example`.
- **Physical device:** Use your machine’s **LAN IP** (e.g. `http://192.168.1.10:3000`); device and computer must share network reachability.

```bash
npx expo start
```

Rebuild native projects when Firebase / Google OAuth identifiers or network security settings change.

---

## Environment variables template

Authoritative commented templates:

- **[`core/.env.example`](core/.env.example)** — API secrets and integrations.
- **[`frontend/.env.example`](frontend/.env.example)** — Public client config (`EXPO_PUBLIC_*`).

### Backend (`core/`) — required keys

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `MONGODB_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes (≥ 16 chars) | Signs access JWTs consumed by protected routes. |
| `OTP_PEPPER` | Yes (≥ 16 chars) | Server secret mixed into OTP hashing. |
| `JWT_EXPIRES_IN` | No | Token lifetime (e.g. `7d`). Default behavior depends on validation schema. |
| `OTP_TTL_MINUTES` | No | OTP validity window. |
| `OTP_MAX_SENDS_PER_HOUR` | No | Rate limit for sending OTPs. |
| `OTP_MAX_ATTEMPTS` | No | Max verification attempts per challenge. |
| `RESEND_API_KEY` | For real email | Empty in dev may rely on logged OTP behavior — confirm locally. |
| `RESEND_FROM_EMAIL` | When sending | Verified sender identity in Resend. |
| `FIREBASE_PROJECT_ID` | For Google / Firebase login | Matches Firebase Console project. |
| `FIREBASE_CLIENT_EMAIL` | For `POST /auth/firebase` | Service account email. |
| `FIREBASE_PRIVATE_KEY` | For `POST /auth/firebase` | PEM private key; use `\n` for newlines in `.env`. |
| `PASSWORD_RESET_*` | Optional | TTL, rate limits, and deep link base for password reset emails. |
| `PORT` | No | HTTP port (default **`3000`**). |

Firebase Admin trio (`FIREBASE_*`) may be omitted at boot per validation but are **required** to use **`POST /auth/firebase`** (Google / Firebase sign-in).

### Frontend (`frontend/`) — public config

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `EXPO_PUBLIC_API_URL` | Yes | Nest API base URL (`https://…` or `http://…`). |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Yes\* | Firebase Web SDK key. |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes\* | Firebase auth domain. |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Yes\* | Project ID. |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes\* | Storage bucket (project default). |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes\* | Sender ID. |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Yes\* | App ID from Firebase Console. |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | For Google Sign-In | Web OAuth client ID (token exchange path). |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | iOS builds | iOS OAuth client ID. |
| `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` | Android builds | Android OAuth client ID + SHA certs in GCP. |

\*Required when using Firebase-powered flows; align with **`GoogleService-Info.plist`** (iOS) and **`google-services.json`** (Android) per Expo/Firebase docs.

**Never commit** real `.env` files. Rotate any key that was exposed in issues, chat, or history.

---

## Folder structure

High-level layout of the monorepo (representative; omitting `node_modules`, build artifacts, and lockfiles):

```text
BatiFlow/
├── README.md
├── core/                          # NestJS API (backend)
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── config/
│   │   ├── database/
│   │   ├── firebase/
│   │   ├── common/
│   │   ├── auth/                  # JWT, OTP, Firebase exchange, guards
│   │   ├── users/
│   │   └── appointments/
│   ├── test/
│   ├── package.json
│   └── .env.example
└── frontend/                      # Expo app
    ├── app/                       # Expo Router routes & layouts
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   ├── (auth)/
    │   └── (app)/
    │       ├── (tabs)/            # Dashboard / settings tabs
    │       └── booking/           # Multi-step booking
    ├── components/
    │   ├── appointments/
    │   ├── auth/
    │   ├── logo/
    │   └── ui/
    ├── hooks/
    │   ├── auth/
    │   └── appointments/
    ├── services/
    │   ├── auth/
    │   ├── appointments/
    │   ├── firebase/
    │   └── storage/
    ├── providers/
    ├── shared/
    │   ├── schemas/
    │   ├── mappers/
    │   ├── state/
    │   └── theme/
    ├── lib/
    ├── api/
    ├── assets/
    ├── package.json
    ├── app.json
    └── .env.example
```

---

## Security

- **JWT access tokens** — Issued after email/password login or successful Firebase verification; sent as **`Authorization: Bearer`** on protected routes (`passport-jwt`, `JwtStrategy`).
- **Firebase ID tokens** — Short-lived Firebase credentials are verified **only on the server** with **Firebase Admin** before the API mints its own JWT.
- **Protected API surface** — Controllers such as **`AppointmentsController`** use **`AuthGuard('jwt')`** end-to-end; **`UsersController`** scopes `/users/me` behind the same guard. Unauthenticated callers cannot access owner-bound data.
- **Secrets hygiene** — `JWT_SECRET`, `OTP_PEPPER`, `RESEND_API_KEY`, and **`FIREBASE_PRIVATE_KEY`** must be treated as production credentials (rotation, secrets manager in deployment, never in client bundles).

---

## Firebase & Resend (quick pointers)

1. **Firebase**: One project for native apps + Admin. Enable **Authentication** providers; add **OAuth clients** for Web / iOS / Android in Google Cloud; map service account JSON fields into **`core/.env`**. Mirror Web config into **`EXPO_PUBLIC_FIREBASE_*`** in the app.
2. **Resend**: Verify a sending domain; create an API key stored only in server env; set **`RESEND_FROM_EMAIL`** to an allowed address.

For detailed copy-paste steps, follow the comments in **[`core/.env.example`](core/.env.example)** and **[`frontend/.env.example`](frontend/.env.example)**.

---

## License

See package-level **`license`** fields (e.g. `core/package.json`, `frontend/package.json`) for terms where specified.
