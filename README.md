# Auction House

A modern, full-featured auction platform built with vanilla JavaScript (ES6+) and Tailwind CSS. This application allows users to create listings, place bids, manage profiles, and participate in a dynamic auction marketplace.

## Project Links

- GitHub Repository: [https://github.com/Hammadniazi/auction-house](https://github.com/Hammadniazi/auction-house)
- Live link: [https://auction-things.netlify.app/](https://auction-things.netlify.app/)
- Figma Design: [https://www.figma.com/design/O0VnMJjD7ro4EPsVS5X4UJ/Action-House?node-id=0-1&p=f&t=9cNTvorvfZCc4Q0J-0](https://www.figma.com/design/O0VnMJjD7ro4EPsVS5X4UJ/Action-House?node-id=0-1&p=f&t=9cNTvorvfZCc4Q0J-0)

## Project overview

- Multi-page app using Vite (dev server + build)
- Styling via Tailwind CSS (integrated with Vite)
- E2E testing using Playwright Test
- Tests live in `tests/e2e/` (auth, homepage, listings, profile, etc.)
- Local dev URL: `http://localhost:5173`

## Tech stack

- Vite (dev server & build)
- Vanilla JavaScript (ES modules)
- Tailwind CSS
- Playwright Test for E2E tests

## Quick start

1. Install dependencies

```bash
npm install
# and install Playwright browsers (required for Playwright tests)
npx playwright install
```

2. Start the dev server

```bash
npm run dev
```

3. Open the app in your browser

Navigate to: http://localhost:5173

## Testing

This project includes comprehensive testing with both **Vitest** (unit tests) and **Playwright** (E2E tests).

### Unit Testing with Vitest

Unit tests are located in `tests/unit/` and test individual functions and modules in isolation.

```bash
# Run unit tests once
npm run test:unit:run

# Run unit tests in watch mode (auto-rerun on changes)
npm run test:unit

# Run unit tests with UI interface
npm run test:unit:ui

# Generate coverage report
npm run test:coverage
```

**Test Structure:**

- `tests/setup.js` - Global setup with localStorage mock
- `tests/unit/helpers.test.js` - Tests for utility functions (validation, formatting, etc.)
- `tests/unit/auth.test.js` - Tests for authentication utilities

**Technologies:**

- Vitest - Fast unit test framework
- jsdom - DOM environment for testing

### End-to-End Testing with Playwright

E2E tests are located in `tests/e2e/` and test full user workflows in a real browser.

```bash
# Start the dev server first
npm run dev

# Then in another terminal, run E2E tests
npm run test
```

**Test Files:**

- `tests/e2e/auth.spec.js` - Login, register, logout
- `tests/e2e/homepage.spec.js` - Homepage functionality
- `tests/e2e/listings.spec.js` - Listing details and creation
- `tests/e2e/profile.spec.js` - User profile management

### Available Test Commands

```bash
# Unit tests
npm run test:unit           # Watch mode (dev)
npm run test:unit:run       # Run once
npm run test:unit:ui        # Interactive UI
npm run test:coverage       # With coverage report

# E2E tests (Playwright)
npm run test                # Run E2E tests
npm run test:ui             # E2E with Playwright UI
```

## Project Structure

```
auction-house/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI for E2E tests
├── pages/                          # HTML pages for multi-page app
│   ├── create-listing.html
│   ├── listing.html
│   ├── login.html
│   ├── profile.html
│   ├── register.html
│   └── userProfile.html
├── public/                         # Static assets
├── src/
│   ├── js/
│   │   ├── api/                    # API client modules
│   │   ├── components/             # Reusable UI components (navigation, footer, listings, etc.)
│   │   ├── config/                 # App configuration (constants, etc.)
│   │   ├── pages/                  # Page-specific JavaScript modules
│   │   └── utils/                  # Utility functions (auth, helpers, etc.)
│   └── styles/
│       └── style.css               # Main stylesheet
├── tests/
│   ├── unit/                       # Vitest unit tests
│   │   ├── auth.test.js            # Authentication utility tests
│   │   └── helpers.test.js         # Helper function tests
│   ├── e2e/                        # Playwright E2E tests
│   │   ├── auth.spec.js            # Authentication tests (login, register, logout)
│   │   ├── homepage.spec.js        # Homepage tests
│   │   ├── listings.spec.js        # Listing detail and create listing tests
│   │   └── profile.spec.js         # User profile tests
│   └── setup.js                    # Vitest global setup (localStorage mock)
├── .eslintcache                    # ESLint cache (gitignored)
├── .gitignore
├── .prettierrc                     # Prettier config
├── eslint.config.js                # ESLint configuration
├── index.html                      # Main entry point
├── netlify.toml                    # Netlify deployment config
├── package.json                    # Dependencies and scripts
├── playwright.config.js            # Playwright test configuration
├── vitest.config.js                # Vitest unit test configuration
├── README.md                       # This file
└── vite.config.js                  # Vite configuration
```

## API

This project uses the Noroff Auction API v2. The API base URL is configured in src/js/config/constants.js.

## License

This project is created as part of a school assignment at Noroff School of Technology and Digital Media.

## Author

- Hammad Khan (@Hammadniazi)

---

** Happy Bidding! **
