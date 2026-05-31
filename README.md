# Robot Order Automation

Automation testing project for RobotSpareBin Industries using Playwright and TypeScript.

## Features

- Page Object Model (POM)
- Data-driven testing with CSV
- Screenshot capture for each order
- Retry mechanism for intermittent server errors
- Playwright HTML report

## Tech Stack

- Playwright
- TypeScript
- Node.js

## Project Structure

```text
data/
pages/
  components/
  modals/
tests/
utils/
```

## Installation

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Run Tests

Run all tests:

```bash
npx playwright test
```

Run specific test:

```bash
npx playwright test tests/order.spec.ts
```

Run in headed mode:

```bash
npx playwright test --headed
```

## Test Data

Test data is stored in:

```text
data/orders.csv
```

## Reports

Open Playwright report:

```bash
npx playwright show-report
```

## Framework Design

- Page Object Model
- Utility Classes
- Data Driven Testing
- Retry Handling for Server Errors

## Author

Keng