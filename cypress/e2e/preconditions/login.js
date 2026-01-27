import { loginApi, loginPage } from "../../support/pages/login";

export function uiLoginAsAdmin() {
  const adminUser = Cypress.env("ADMIN_USER");
  const adminPass = Cypress.env("ADMIN_PASS");
  if (!adminUser || !adminPass) {
    throw new Error(
      "Missing admin credentials. Set ADMIN_USER and ADMIN_PASS in your .env (or as CYPRESS_ADMIN_USER/CYPRESS_ADMIN_PASS).",
    );
  }

  loginPage.visitLoginPage();
  loginPage.login(adminUser, adminPass);
  cy.url().should("include", Cypress.env("BASE_URL") + "/ui/dashboard");
}

export function uiLoginAsUser() {
  const userUser = Cypress.env("USER_USER");
  const userPass = Cypress.env("USER_PASS");
  if (!userUser || !userPass) {
    throw new Error(
      "Missing user credentials. Set USER_USER and USER_PASS in your .env (or as CYPRESS_USER_USER/CYPRESS_USER_PASS).",
    );
  }

  loginPage.visitLoginPage();
  loginPage.login(userUser, userPass);
  cy.url().should("include", Cypress.env("BASE_URL") + "/ui/dashboard");
}

export function apiLoginAsAdmin() {
  const adminUser = Cypress.env("ADMIN_USER");
  const adminPass = Cypress.env("ADMIN_PASS");
  if (!adminUser || !adminPass) {
    throw new Error(
      "Missing admin credentials. Set ADMIN_USER and ADMIN_PASS in your .env (or as CYPRESS_ADMIN_USER/CYPRESS_ADMIN_PASS).",
    );
  }  

  return loginApi.getAuthToken(adminUser, adminPass).then((token) => {
    expect(token, "auth token").to.be.a("string").and.not.be.empty;
    return cy.wrap(token, { log: false }).as("authToken");
  });
}


export function apiLoginAsUser() {
  const userUser = Cypress.env("USER_USER");
  const userPass = Cypress.env("USER_PASS");
  if (!userUser || !userPass) {
    throw new Error(
      "Missing user credentials. Set USER_USER and USER_PASS in your .env (or as CYPRESS_USER_USER/CYPRESS_USER_PASS).",
    );
  }
  return loginApi.getAuthToken(userUser, userPass).then((token) => {
    expect(token, "auth token").to.be.a("string").and.not.be.empty;
    return cy.wrap(token, { log: false }).as("authToken");
  });
}