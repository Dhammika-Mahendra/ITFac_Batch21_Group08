const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  env: {
    allure: true,
  },
  e2e: {
    specPattern: "cypress/e2e/**/*.feature",
    stepDefinitions: "cypress/e2e",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      require("@shelex/cypress-allure-plugin/writer")(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      );

      // Register SQL execution task
      on("task", {
        async executeSql(sqlFilePath) {
          const connection = await mysql.createConnection({
            host: config.env.DB_HOST || "localhost",
            user: config.env.DB_USER || "root",
            password: config.env.DB_PASSWORD || "desh2000",
            database: config.env.DB_NAME || "qa_training",
            multipleStatements: true
          });

          try {
            const sqlContent = fs.readFileSync(path.resolve(sqlFilePath), "utf8");
            // Split SQL statements and execute them one by one
            const statements = sqlContent
              .split('\n')
              .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
              .join('\n')
              .split(';')
              .map(s => s.trim())
              .filter(s => s.length > 0);
            
            for (const statement of statements) {
              await connection.query(statement);
            }
            
            await connection.end();
            return { success: true };
          } catch (error) {
            await connection.end();
            return { success: false, error: error.message };
          }
        }
      });

      return config;
    },
  },
});
