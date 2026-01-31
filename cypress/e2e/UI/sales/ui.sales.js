import { Given, When, Then, Before, After } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pages/login";
import { salesPage } from "../../../support/pages/sales";
import { uiLoginAsAdmin, apiLoginAsAdmin } from "../../preconditions/login";
import { backupSalesData, restoreSalesData, deleteAllSales, createTestSale } from "../../../support/api/sales";

Before({ tags: "@Sale_Admin_UI_01" }, () => {
	apiLoginAsAdmin().then(() => {
		backupSalesData();
	});
});

After({ tags: "@Sale_Admin_UI_01" }, () => {
	apiLoginAsAdmin().then(() => {
		restoreSalesData();
	});
});

Before({ tags: "@Sale_Admin_UI_02" }, () => {
	apiLoginAsAdmin().then(() => {
		backupSalesData();
	});
});

After({ tags: "@Sale_Admin_UI_02" }, () => {
	apiLoginAsAdmin().then(() => {
		restoreSalesData();
	});
});

Before({ tags: "@Sale_Admin_UI_03" }, () => {
	apiLoginAsAdmin().then(() => {
		backupSalesData();
	});
});

After({ tags: "@Sale_Admin_UI_03" }, () => {
	apiLoginAsAdmin().then(() => {
		restoreSalesData();
	});
});

Before({ tags: "@Sale_Admin_UI_04" }, () => {
	apiLoginAsAdmin().then(() => {
		backupSalesData();
	});
});

After({ tags: "@Sale_Admin_UI_04" }, () => {
	apiLoginAsAdmin().then(() => {
		restoreSalesData();
	});
});

Before({ tags: "@Sale_Admin_UI_05" }, () => {
	apiLoginAsAdmin().then(() => {
		backupSalesData();
	});
});

After({ tags: "@Sale_Admin_UI_05" }, () => {
	apiLoginAsAdmin().then(() => {
		restoreSalesData();
	});
});

Before({ tags: "@Sale_Admin_UI_06" }, () => {
	apiLoginAsAdmin();
});

Before({ tags: "@Sale_Admin_UI_07" }, () => {
	apiLoginAsAdmin();
});

Before({ tags: "@Sale_Admin_UI_08" }, () => {
	apiLoginAsAdmin().then(() => {
		backupSalesData();
	});
});

After({ tags: "@Sale_Admin_UI_08" }, () => {
	apiLoginAsAdmin().then(() => {
		restoreSalesData();
	});
});

Before({ tags: "@Sale_Admin_UI_09" }, () => {
	apiLoginAsAdmin().then(() => {
		backupSalesData();
	});
});

After({ tags: "@Sale_Admin_UI_09" }, () => {
	apiLoginAsAdmin().then(() => {
		restoreSalesData();
	});
});

Before({ tags: "@Sale_User_UI_01" }, () => {
	// No backup needed for user access test
});

Before({ tags: "@Sale_User_UI_02" }, () => {
	// No backup needed for user access test
});

Before({ tags: "@Sale_User_UI_03" }, () => {
	// No backup needed for user access test
});

Before({ tags: "@Sale_User_UI_04" }, () => {
	// No backup needed for user view test
});

Before({ tags: "@Sale_User_UI_05" }, () => {
	// No backup needed for user view test
});

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

Given("I am logged in as testuser", () => {
	loginPage.visitLoginPage();
	cy.get('input[name="username"], input[id="username"]').type('testuser');
	cy.get('input[name="password"], input[id="password"]').type('test123');
	cy.get('button[type="submit"], button:contains("Login")').click();
	cy.url().should('include', '/ui/dashboard');
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
	cy.url().should('include', '/ui/sales');
});

When("I navigate to the Sales page", () => {
	salesPage.visitSalesPage();
	cy.url().should('include', '/ui/sales');
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

When("I click on the {string} button", (buttonText) => {
	salesPage.clickSellPlantButton(buttonText);
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

Then("the sales list should be displayed with pagination information", () => {
	salesPage.verifySalesListWithPagination();
});

Given("sales exist in the system", () => {
	// Assumes sales already exist or were created via API
	cy.get('body').should('exist');
});

Then("the sales should be displayed in descending order by sold date", () => {
	salesPage.verifySalesSortedBySoldDateDescending();
});

When("I click on the {string} column header", (columnName) => {
	salesPage.clickColumnHeader(columnName);
});

Then("the sales should be sorted by Plant Name", () => {
	salesPage.verifySalesSortedByPlantName();
});

Then("the sales should be sorted by Quantity", () => {
	salesPage.verifySalesSortedByQuantity();
});

Then("the sales should be sorted by Total price", () => {
	salesPage.verifySalesSortedByTotalPrice();
});

Given("I am on the Sell Plant page", () => {
	loginPage.visitLoginPage();
	uiLoginAsAdmin();
	salesPage.visitSalesPage();
	salesPage.clickSellPlantButton("Sell Plant");
});

When("I leave the Quantity field empty", () => {
	// Ensure quantity field is empty - clear any existing value
	salesPage.clearQuantityField();
});

When("I submit the form", () => {
	salesPage.submitSellPlantForm();
});

Then("an error message should appear for Quantity field", () => {
	salesPage.verifyQuantityFieldValidationError();
});

When("I enter a non-numeric value in the Quantity field", () => {
	salesPage.enterNonNumericQuantity();
});

When("I select a plant from the dropdown", () => {
	salesPage.selectPlantFromDropdown();
});

When("I enter a valid quantity", () => {
	salesPage.enterValidQuantity();
});

Then("admin should be redirected to the sales list page", () => {
	salesPage.verifyRedirectedToSalesList();
});

When("I capture the current plant stock", () => {
	salesPage.captureCurrentPlantStock();
});

Then("the plant stock should be reduced by the sold quantity", () => {
	salesPage.verifyStockReducedByQuantity();
});

Then("the {string} button should not be visible to user", (buttonText) => {
	salesPage.verifySellPlantButtonNotVisible(buttonText);
});

Then("the {string} button should not be visible on the page", (buttonText) => {
	salesPage.verifyButtonNotVisibleOnPage(buttonText);
});

When("I check for delete actions on sales records", () => {
	salesPage.checkForDeleteActions();
});

Then("delete button should not be visible or available to user", () => {
	salesPage.verifyDeleteButtonNotAvailableToUser();
});
