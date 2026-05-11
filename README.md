# Playwright Portfolio — practicesoftwaretesting.com

Automation testing portfolio built with Playwright + TypeScript, targeting [practicesoftwaretesting.com](https://practicesoftwaretesting.com) (Toolshop).

Covers E2E UI testing, API testing, and hybrid API+UI flows.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Playwright 1.47 |
| Language | TypeScript |
| API Testing | Playwright `APIRequestContext` |
| CI/CD | GitHub Actions |
| Reporting | Playwright HTML Reporter |

---

## Project Structure

```
├── fixtures/
│   └── testData.ts          # Shared test data, factories, helpers
├── pages/
│   └── login/
│       └── loginPage.ts     # Page Object Model — login page
├── tests/
│   ├── api/
│   │   ├── auth.api.ts      # Auth API wrapper (register, login)
│   │   ├── cart.api.ts      # Cart API wrapper (CRUD operations)
│   │   └── products.api.ts  # Products API wrapper (search, filter)
│   └── specs/
│       ├── api-only.spec.ts     # Pure API tests — backend validation
│       ├── checkout.spec.ts     # Hybrid API+UI — checkout flow
│       └── home.spec.ts         # UI tests — homepage and login
├── playwright.config.ts
└── .env.example
```

---

## Test Coverage

### API Tests (`api-only.spec.ts`)
- User registration — response structure validation
- Login with valid credentials — token assertion
- Login with invalid credentials — error handling
- Get all products — schema and data validation
- Add and remove cart items — full cart lifecycle
- Concurrent cart operations — `Promise.all` parallel adds
- Product search — result relevance validation

### Hybrid API + UI (`checkout.spec.ts`)
- API setup (register + login) → UI execution
- Pre-authenticated session via API, UI interaction via browser

### UI Tests (`home.spec.ts`)
- Visual regression snapshot — homepage
- Login via Page Object Model
- API-seeded test user → UI login verification

---

## Design Decisions

**API layer separation** — All API calls are wrapped in dedicated classes (`AuthAPI`, `CartAPI`, `ProductsAPI`) rather than inline in specs. This keeps specs readable and makes the API layer reusable across test files.

**Hybrid API+UI pattern** — Test setup (user creation, login) is done via API for speed and reliability. UI tests only cover what requires a browser, reducing flakiness from UI-only setup flows.

**Dynamic test data** — `createTestUserData()` generates unique emails per test run using `Date.now()` + random suffix. Prevents state pollution between runs without needing database cleanup.

**No shared auth state between tests** — Each test provisions its own user. Slower than a shared session fixture but eliminates inter-test dependency.

---

## Setup

### Prerequisites
- Node.js 18+
- Git

### Install

```bash
git clone https://github.com/YOUR_USERNAME/playwright-porto.git
cd playwright-porto
npm install
npx playwright install chromium
```

### Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```
URL=https://practicesoftwaretesting.com
EMAIL=your_email_here
PASSWORD=your_password_here
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run on Chromium only
npm run test:chromium

# Run API tests only
npx playwright test --grep @api

# Open interactive UI mode
npm run test:ui

# Run and open HTML report
npm run test:report
```

---

## CI/CD

Tests run on GitHub Actions on every push and pull request to `main`.

> **Note:** The target site (`practicesoftwaretesting.com`) is a public demo environment not under this project's control. Occasional CI failures caused by upstream site instability or data resets are expected and do not reflect test logic errors. Run locally for consistent results.

---

## Known Limitations

- Firefox and WebKit projects are configured but disabled — Chromium only for now
- `checkout.spec.ts` covers API setup + login verification; full checkout UI flow (cart → payment) is in progress
- Visual snapshot tests (`home.spec.ts`) are environment-sensitive and may need regeneration after site updates: `npx playwright test --update-snapshots`
