import { Given, When, Then, Before, After } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pages/login";
import { salesPage } from "../../../support/pages/sales";
import { uiLoginAsAdmin, uiLoginAsUser, apiLoginAsAdmin, apiLoginAsUser } from "../../preconditions/login";
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

Before({ tags: "@Sale_User_UI_10" }, () => {
	apiLoginAsUser().then(() => {
		backupSalesData();
	});
});

After({ tags: "@Sale_User_UI_10" }, () => {
	apiLoginAsUser().then(() => {
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

When("I capture the plant name and quantity from the first sale", () => {
	salesPage.captureFirstSaleDetails();
});

When("I click the delete icon on a sale", () => {
	salesPage.clickDeleteIconOnFirstSale();
});

Then("I should see {string} message displayed", (message) => {
	// Verify the page shows the expected empty state message
	salesPage.verifyNoSalesMessage(message);
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

When("I navigate to the plants page", () => {
	salesPage.visitPlantPage();
});

Then("the plant stock should be increased by the deleted sale quantity", () => {
	salesPage.verifyPlantStockIncreased();
});

Then("the {string} button should be visible", (buttonText) => {
	salesPage.verifySellPlantButtonVisible(buttonText);
});

When("I click on the {string} button", (buttonText) => {
	if (buttonText === "Sell Plant") {
		salesPage.clickSellPlantButton(buttonText);
	} else if (buttonText === "Sell") {
		salesPage.clickSellButton();
	}
});

Then("the Sell Plant page should be displayed and accessible", () => {
	salesPage.verifySellPlantPageAccessible();
});

When("I click on the plant dropdown", () => {
	salesPage.clickPlantDropdown();
});

Then("the plant dropdown should display all available plants with their current stock", () => {
	salesPage.verifyPlantDropdownDisplaysPlantsWithStock();
});

When("I leave the plant field empty", () => {
	salesPage.leavePlantFieldEmpty();
});

When("I enter valid quantity {string}", (quantity) => {
	salesPage.enterQuantity(quantity);
});

Then("the error message {string} should be displayed", (errorMessage) => {
	salesPage.verifyErrorMessageDisplayed(errorMessage);
});

When("I select a plant from the dropdown", () => {
	salesPage.selectFirstAvailablePlant();
});

When("I enter negative quantity {string}", (quantity) => {
	salesPage.enterQuantity(quantity);
});

When("I enter quantity {string}", (quantity) => {
	salesPage.enterQuantity(quantity);
});

Given("I am logged in as user", () => {
	loginPage.visitLoginPage();
	uiLoginAsUser();
});

Given("sales exist", () => {
	// Sales already exist in the system - no action needed
	cy.log("Sales exist in the system");
});

When("I click on {string} column header to change sort order", (columnName) => {
	salesPage.clickColumnHeader(columnName);
});

Then("the sales records should be sorted correctly by Plant Name", () => {
	salesPage.verifySalesSortedByPlantName();
});

Then("the sales records should be sorted correctly by Quantity", () => {
	salesPage.verifySalesSortedByQuantity();
});

Then("the sales records should be sorted correctly by Total Price", () => {
	salesPage.verifySalesSortedByTotalPrice();
});

Then("the sales records should be sorted correctly by Sold Date", () => {
	salesPage.verifySalesSortedBySoldDate();
});
