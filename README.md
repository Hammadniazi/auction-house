# Auction House

A modern, full-featured auction platform built with vanilla JavaScript (ES6+) and Tailwind CSS. This application allows users to create listings, place bids, manage profiles, and participate in a dynamic auction marketplace.

## Project Links

- GitHub Repository: [https://github.com/Hammadniazi/auction-house](https://github.com/Hammadniazi/auction-house)
- Live link: [https://auction-things.netlify.app/](https://auction-things.netlify.app/)
- Figma Design: [https://www.figma.com/design/O0VnMJjD7ro4EPsVS5X4UJ/Action-House?node-id=0-1&p=f&t=9cNTvorvfZCc4Q0J-0](https://www.figma.com/design/O0VnMJjD7ro4EPsVS5X4UJ/Action-House?node-id=0-1&p=f&t=9cNTvorvfZCc4Q0J-0)
- Figma Style Guide: [https://www.figma.com/design/O0VnMJjD7ro4EPsVS5X4UJ/Action-House?node-id=97-744&t=zZGmswaPnF1G96kE-1](https://www.figma.com/design/O0VnMJjD7ro4EPsVS5X4UJ/Action-House?node-id=97-744&t=zZGmswaPnF1G96kE-1)
- Kanban Board: [https://github.com/users/Hammadniazi/projects/9/views/1](https://github.com/users/Hammadniazi/projects/9/views/1)
- Gannt Chart: [https://github.com/users/Hammadniazi/projects/9/views/4?sortedBy%5Bdirection%5D=asc&sortedBy%5BcolumnId%5D=237777340](https://github.com/users/Hammadniazi/projects/9/views/4?sortedBy%5Bdirection%5D=asc&sortedBy%5BcolumnId%5D=237777340)

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
npm run test:unit:run
npm run test:unit
npm run test:unit:ui
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
npm run dev
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
npm run test:unit
npm run test:unit:run
npm run test:unit:ui

# E2E tests (Playwright)
npm run test
npm run test:ui
```

## Project Structure

```
auction-house/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── pages/
│   ├── create-listing.html
│   ├── listing.html
│   ├── login.html
│   ├── profile.html
│   ├── register.html
│   └── userProfile.html
├── public/
├── src/
│   ├── js/
│   │   ├── api/
│   │   ├── components/
│   │   ├── config/
│   │   ├── pages/
│   │   └── utils/
│   └── styles/
│       └── style.css
├── tests/
│   ├── unit/
│   │   ├── auth.test.js
│   │   └── helpers.test.js
│   ├── e2e/
│   │   ├── auth.spec.js
│   │   ├── homepage.spec.js
│   │   ├── listings.spec.js
│   │   └── profile.spec.js
│   └── setup.js
├── .eslintcache
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── netlify.toml
├── package.json
├── playwright.config.js
├── vitest.config.js
├── README.md
└── vite.config.js
```

## API

This project uses the Noroff Auction API v2. The API base URL is configured in src/js/config/constants.js.

## License

This project is created as part of a school assignment at Noroff School of Technology and Digital Media.

## Author

- Hammad Khan (@Hammadniazi)

---

** Happy Bidding! **
