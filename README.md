# Rentzila Playwright Tests

## Description

This project contains end-to-end tests for the Rentzila web site using Playwright. It ensures the functionality and quality of the Rentzila web site through automated browser testing.

## Prerequisites

- [Node.js >= 18.0.0]
- [npm]

## Installation

1. Clone repository:

   ```bash
   git clone https://github.com/ArtemPerehonchuk/rentzila-playwright-tests.git
   ```

2. Navigate to the project directory:

   ```bash
   cd rentzila-playwright-tests
   ```

3. Install Playwright:

   ```bash
   npx playwright install
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Create an .env file:

   In the project root directory, create an .env file by copying the example.env file:

   ```bash
   cp example.env .env
   ```

   Then, update the .env file with your specific environment variables, such as credentials and homepage URL.

## Running Tests

### Using Bash Script

1. **Run All Tests:**
   To run all tests using the default configuration:

   ```bash
   ./run-tests.sh all
   ```

2. **Run Specific Test Files:**
   To run a specific test file:

   ```bash
   ./run-tests.sh tests/test.login.spec.ts
   ```

3. **Run Tests by Category:**
   To run tests based on a keyword (e.g., "services"):

   ```bash
   ./run-tests.sh services
   ```

4. **Customize Execution:**
   Pass additional Playwright options such as workers or projects:

   ```bash
   ./run-tests.sh all --workers=1 --project=firefox
   ```

### Using npm Scripts

1. Run all tests:

   ```bash
   npm run test
   ```

2. Run specific tests or categories:

   ```bash
   npm run test:run services
   ```

3. Open test report:

   ```bash
   npm run test:report
   ```

## GitHub Pages

View report on GitHub Pages:

[GitHub Pages Report](https://artemperehonchuk.github.io/rentzila-playwright-team/)

