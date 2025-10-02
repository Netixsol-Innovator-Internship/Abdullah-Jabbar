

## Week10-Day4 Frontend Testing

github URL: https://github.com/Netixsol-Innovator-Internship/Abdullah-Jabbar/tree/main/Week%203/Day-3/frontend

This project includes end-to-end (E2E) tests using Playwright to ensure the application works correctly from the user's perspective.

### Test Coverage

The E2E tests cover critical user flows including:

- User authentication (login and registration)
- Task management (create, read, update, delete tasks)
- Navigation between pages
- Form submissions and validations

### Running Tests

- **Headless mode** (default): `pnpm test`
- **Visual mode** (with browser windows): `pnpm test:headed`
- **Interactive UI mode** (for debugging): `pnpm test:ui`

### Viewing Test Reports

After running tests, view the HTML report:

```bash
pnpm exec playwright show-report
```

The report provides detailed results, screenshots, and traces for failed tests.

### Test Setup

- Tests run on Chromium and WebKit browsers
- API calls are mocked to simulate backend responses
- The Vite dev server starts automatically on port 5173
- No backend server required for testing
