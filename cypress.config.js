const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.feature",
    stepDefinitions: "cypress/e2e",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      );

      // Load environment variables from cypress.env.json
      const envFile = path.join(__dirname, "app", "cypress.env.json");
      if (fs.existsSync(envFile)) {
        const envConfig = JSON.parse(fs.readFileSync(envFile, "utf-8"));
        config.env = { ...config.env, ...envConfig };
      }

      return config;
    },
  },
});
