import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pages/login";
import { dashboardPage } from "../../../support/pages/dashboard";
import { uiLoginAsAdmin, uiLoginAsUser } from "../../preconditions/login";

Given("I open the login page", () => {
	loginPage.visitLoginPage();
});

When("I sign in with valid admin user credentials", () => {
	uiLoginAsAdmin();
});

When("I sign in with valid non-admin user credentials", () => {
	uiLoginAsUser();
});

Then("I should be redirected to the dashboard", () => {
	cy.url().should("include", "/ui/dashboard");
});

Then("Navigation menu highlights the active pages", () => {
	dashboardPage.verifyActiveDashboardLink();
	dashboardPage.verifyActiveCategoriesLink();
	dashboardPage.verifyActivePlantsLink();
	dashboardPage.verifyActiveSalesLink();
});

Then("Category, Plants and Sales summary information will be displayed", () => {
	dashboardPage.verifySummaryCards();
});