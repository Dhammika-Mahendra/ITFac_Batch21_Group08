# IT Quality Assurance Test Project

Welcome to the QA Test Project repository! This project is designed for automated testing using Cypress and a prebuilt Java application. Follow the instructions below to set up and run the tests.

## Project Structure

- `app/` — Contains the precompiled Java application JAR file (`application.properties` and the JAR itself).
- `cypress/` — Contains all Cypress test files, including API and UI tests, fixtures, and support files.
- `cypress.config.js` — Cypress configuration file.
- `cypress.env.json` — Cypress environment variables.
- `package.json` — Node.js dependencies and scripts.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [Java](https://www.java.com/) (for running the JAR file)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Setup

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the Java Application:**
   - Navigate to the `app` folder and run the JAR file.
   - This will also create the tables with corresponding schema
   ```sh
   cd app
   java -jar qa-training-app.jar
   ```
   - Ensure the application is running before executing Cypress tests.

4. **Add sample data to database**
   - Run the seeding file to add populate the database
   ```sh
   npm run db:seed
   ```

5. **Run Cypress Tests:**
   - Open a new terminal and return to the project root directory.
   - Use the following command to run all tests:
   ```sh
   npx cypress run
   ```
   - To run specific test cases using tags/annotations (e.g., `@Cat_User_API_01`):
   ```sh
   npx cypress run --spec cypress/e2e/API/category/api.category.feature --env tags=@Cat_User_API_01
   ```
   - Replace the spec path and tag as needed for other test cases.

## Test Organization

- **API Tests:** Located in `cypress/e2e/API/` (organized by feature: category, dashboard, plants, sales).
- **UI Tests:** Located in `cypress/e2e/UI/` (organized by feature).
- **Preconditions:** Common setup scripts in `cypress/e2e/preconditions/`.
- **Fixtures:** Test data in `cypress/fixtures/`.
- **Support:** Custom commands and page objects in `cypress/support/`.

## Writing and Running Tests

- Test cases are written in `.feature` and `.js` files.
- Use `@annotations` in feature files to tag and run specific tests.
- Example command to run a test with a specific tag:
  ```sh
  npx cypress run --env tags=@YourTag
  ```

## Allure Report

1. **Run Cypress tests (generates `allure-results/`):**
   ```sh
   npm run cy:run
   ```

2. **Generate the report:**
   ```sh
   npm run allure:generate
   ```

3. **Open the report:**
   ```sh
   npm run allure:open
   ```

## Additional Notes

- Screenshots and test results are saved in the `cypress/screenshots/` directory.
- Update the JAR file in the `app` folder as needed for backend changes.

## Troubleshooting

- Ensure the Java application is running before starting Cypress tests.
- If you encounter issues, check the application logs and Cypress output for errors.

---

For further questions, please contact the repository maintainer.
