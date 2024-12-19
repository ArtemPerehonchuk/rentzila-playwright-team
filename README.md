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
    ````

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
1. Run All Tests:
To run all tests using the default browser configuration:

    ```bash
    npm run test
    ```

2. To run specific test file:

- Run tests for services:

    ```bash
    npm run test:services
    ```

- Run tests for footer elements:

    ```bash
    npm run test:footer-elements
    ```

- Run tests for login:

    ```bash
    npm run test:login
    ```

- Run tests for main info tab on create unit page:

    ```bash
    npm run test:unit-page-main-info-tab
    ```

- Run tests for photo tab on create unit page:

    ```bash
    npm run test:photo-tab
    ```

- Run tests for prices tab on create unit page:

    ```bash
    npm run test:prices-tab
    ```

- Run tests for services tab on create unit page:

    ```bash
    npm run test:services-tab
    ```

- Run tests for creating unit using API:

    ```bash
    npm run test:api
    ```

- Run tests for edit unit functionality:

    ```bash
    npm run test:edit-unit
    ```

- Run tests for create tender functionality:

    ```bash
    npm run test:create-tender
    ```

- Run tests for edit rejected tender functionality:

    ```bash
    npm run test:edit-rejected-tender
    ```
## GitHub Pages

View report on GitHub Pages:

https://artemperehonchuk.github.io/rentzila-playwright-team/