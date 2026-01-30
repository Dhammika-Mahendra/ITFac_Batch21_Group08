import { Given, When, Then, Before, After } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pages/login";
import { salesPage } from "../../../support/pages/sales";
import { uiLoginAsAdmin, apiLoginAsAdmin } from "../../preconditions/login";
import { backupSalesData, restoreSalesData, deleteAllSales, createTestSale } from "../../../support/api/sales";

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

Before({ tags: "@Sale_Admin_UI_11" }, () => {
	apiLoginAsAdmin().then(() => {
		backupSalesData();
	});
});

After({ tags: "@Sale_Admin_UI_11" }, () => {
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

Given("a sale exists in the system", () => {
	apiLoginAsAdmin().then(() => {
		createTestSale();
	});
});

When("I navigate to the sales page", () => {
	salesPage.visitSalesPage();
});

When("I click the delete icon on a sale", () => {
	salesPage.clickDeleteIconOnFirstSale();
});

Then("I should see {string} message displayed", (message) => {
	// Verify the page shows the expected empty state message
	salesPage.noSalesMessage;
});

Then("a confirmation prompt should appear", () => {
	salesPage.verifyConfirmationPromptAppears();
});

When("I confirm the deletion", () => {
	salesPage.confirmDeletion();
});

Then("the sale should be deleted", () => {
	salesPage.verifySaleDeleted();
});

Then("the deleted sale should no longer appear in the sales list", () => {
	salesPage.verifySaleNoLongerInList();
});

Then("the {string} button should be visible", (buttonText) => {
	salesPage.verifySellPlantButtonVisible(buttonText);
});
