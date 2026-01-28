import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pages/login";
import { salesPage } from "../../../support/pages/sales";
import { uiLoginAsAdmin } from "../../preconditions/login";

Given("I am logged in as admin", () => {
	loginPage.visitLoginPage();
	uiLoginAsAdmin();
});

Given("no sales exist in the system", () => {
	// Precondition: Ensure no sales exist
	// This could be handled via API cleanup or database reset
	// For now, we assume the test environment has no sales
	cy.log("Assuming no sales exist in the system");
});

When("I navigate to the sales page", () => {
	salesPage.visitSalesPage();
});

Then("I should see {string} message displayed", (message) => {
	salesPage.noSalesMessage.should("be.visible");
	salesPage.noSalesMessage.should("contain.text", message);
});
