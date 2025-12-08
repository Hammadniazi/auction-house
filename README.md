# Auction House

A modern, full-featured auction platform built with vanilla JavaScript (ES6+) and Tailwind CSS. This application allows users to create listings, place bids, manage profiles, and participate in a dynamic auction marketplace.

## Project Links

- GitHub Repository: [https://github.com/Hammadniazi/auction-house](https://github.com/Hammadniazi/auction-house)
- Live link: [https://auction-things.netlify.app/](https://auction-things.netlify.app/)

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

This project includes comprehensive testing with Vitest and Playwright.

### Run Unit Tests

```bash
npm test
```

### Run E2E Tests

```bash
# Terminal 1 - Start dev server:
npm run dev

# Terminal 2 - Run E2E tests:
npm run test:e2e
```

### Test Commands

```bash
npm test # Run unit tests
npm run test:ui # Unit tests with UI
npm run test:e2e # Run E2E tests
npm run test:e2e:ui # E2E tests with UI
npm run test:e2e:headed  # E2E tests in browser
npm run test:all         # Run all tests
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
│   └── e2e/                        # Playwright E2E tests
│       ├── auth.spec.js            # Authentication tests (login, register, logout)
│       ├── homepage.spec.js        # Homepage tests
│       ├── listings.spec.js        # Listing detail and create listing tests
│       └── profile.spec.js         # User profile tests
├── .eslintcache                    # ESLint cache (gitignored)
├── .gitignore
├── .prettierrc                     # Prettier config
├── eslint.config.js                # ESLint configuration
├── index.html                      # Main entry point
├── netlify.toml                    # Netlify deployment config
├── package.json                    # Dependencies and scripts
├── playwright.config.js            # Playwright test configuration
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
