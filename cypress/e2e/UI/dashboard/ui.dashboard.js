import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pages/login";
import { dashboardPage } from "../../../support/pages/dashboard";
import { uiLoginAsAdmin } from "../../preconditions/login";

Given("I open the login page", () => {
	loginPage.visitLoginPage();
});

When("I sign in with valid credentials", () => {
	uiLoginAsAdmin();
});

Then("I should be redirected to the dashboard", () => {
	cy.url().should("include", "/ui/dashboard");
});

Then("the dashboard navigation menu should be visible", () => {
	dashboardPage.navigationMenu.should("be.visible");
});
