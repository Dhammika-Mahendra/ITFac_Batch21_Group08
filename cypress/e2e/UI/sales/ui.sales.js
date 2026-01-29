import { Given, When, Then, Before, After } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pages/login";
import { salesPage } from "../../../support/pages/sales";
import { uiLoginAsAdmin, apiLoginAsAdmin } from "../../preconditions/login";
import { backupSalesData, restoreSalesData, deleteAllSales } from "../../../support/api/sales";

Before({ tags: "@Sale_Admin_UI_10" }, () => {
	apiLoginAsAdmin().then(() => {
		backupSalesData();
	});
});

After({ tags: "@Sale_Admin_UI_10" }, () => {
	apiLoginAsAdmin().then(() => {
		restoreSalesData();
	});
});

Given("I am logged in as admin", () => {
	loginPage.visitLoginPage();
	uiLoginAsAdmin();
});

Given("no sales exist in the system", () => {
	deleteAllSales();
});

When("I navigate to the sales page", () => {
	salesPage.visitSalesPage();
});

Then("I should see {string} message displayed", (message) => {
	// Verify the page shows the expected empty state message
	cy.get('body').should('contain.text', message);
});
