import { Given, When, Then, Before, After } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pages/login";
import { salesPage } from "../../../support/pages/sales";
import { uiLoginAsAdmin, uiLoginAsUser, apiLoginAsAdmin, apiLoginAsUser } from "../../preconditions/login";
import { backupSalesData as sqlBackupSalesData, restoreSalesData as sqlRestoreSalesData, deleteAllSales as sqlDeleteAllSales } from "../../../support/sql/sqlSales";
import { backupSalesData, restoreSalesData } from "../../../support/api/sales.js";

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
		backupSalesData(); // Backup the sales data before the test
	});
});

After({ tags: "@Sale_Admin_UI_09" }, () => {
	apiLoginAsAdmin().then(() => {
		restoreSalesData(); // Restore the sales data after the test to ensure no test data remains
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
	cy.then(() => {
		sqlBackupSalesData();
	});
});

After({ tags: "@Sale_Admin_UI_10" }, () => {
	cy.then(() => {
    	sqlRestoreSalesData();
  	});
});

Before({ tags: "@Sale_User_UI_10" }, () => {
	cy.then(() => {
		sqlBackupSalesData();
	});
});

After({ tags: "@Sale_User_UI_10" }, () => {
	cy.then(() => {
    	sqlRestoreSalesData();
  	});
});

Before({ tags: "@Sale_Admin_UI_11" }, () => {
	cy.then(() => {
		sqlBackupSalesData();
	});
});

After({ tags: "@Sale_Admin_UI_11" }, () => {
	cy.then(() => {
    	sqlRestoreSalesData();
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
	sqlDeleteAllSales();
});

When("I navigate to the sales page", () => {
	salesPage.visitSalesPage();
	cy.url().should('include', '/ui/sales');
});

When("I navigate to the Sales page", () => {
	salesPage.visitSalesPage();
	cy.url().should('include', '/ui/sales');
});

When("I capture the plant name and quantity from the first sale", () => {
	salesPage.captureFirstSaleDetails();
	cy.get('@deletedSalePlantName').then((plantName) => {
		cy.log(`Alias @deletedSalePlantName set with value: ${plantName}`); // Debug log to confirm alias is set
	});
});

When("I capture the current plant stock", () => {
	salesPage.captureCurrentPlantStock();
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

Then("the sales list should be displayed with pagination information", () => {
	salesPage.verifySalesListWithPagination();
});

Given("sales exist in the system", () => {
	// Assumes sales already exist or were created via API
	cy.get('body').should('exist');
});

Then("the sales should be displayed in descending order by sold date", function () {
    // Verify that the sales are displayed in descending order by sold date
    salesPage.verifySalesSortedBySoldDateDescending();
});

When("I click on the {string} column header", (columnName) => {
	salesPage.clickAdminColumnHeader(columnName);
});

Then("the sales should be sorted by Plant Name", () => {
	salesPage.verifyAdminSalesSortedByPlantName();
});

Then("the sales should be sorted by Quantity", () => {
	salesPage.verifyAdminSalesSortedByQuantity();
});

Then("the sales should be sorted by Total price", () => {
	salesPage.verifyAdminSalesSortedByTotalPrice();
});

Then("the sales should be sorted by Plant", () => {
    salesPage.verifySalesSortedByPlant();
});

Given("I am on the Sales page", () => {
	salesPage.visitSalesPage();
	cy.url().should('include', '/ui/sales');
});

Given("I am on the Sell Plant page", () => {
	loginPage.visitLoginPage();
	uiLoginAsAdmin();
	salesPage.visitSalesPage();
	salesPage.clickSellPlantButton("Sell Plant");
});
When ("the Quantity field should not accept the non-numeric value", () => {
	// Verify that the quantity field does not accept non-numeric input
	cy.get('input.form-control#quantity').should('have.attr', 'type', 'number');
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

When("I try to enter a non-numeric value in the Quantity field", () => {
    // getv the inout of class form-control and id quantity
	//verify type is number and does not accept non-numeric input
	cy.get('input.form-control#quantity').should('have.attr', 'type', 'number');
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

When("I redirected to the sales list page", () => {
	salesPage.verifyRedirectedToSalesList();
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
When("I leave the plant field empty", () => {
	salesPage.leavePlantFieldEmpty();
});

When("I enter valid quantity {string}", (quantity) => {
	salesPage.enterQuantity(quantity);
});

Then("the error message {string} should be displayed", (errorMessage) => {
	salesPage.verifyErrorMessageDisplayed(errorMessage);
});

When("I select first available plant from the dropdown", () => {
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

Then("I should be denied access to the sales page", () => {
    // Verify the user is redirected to an access denied page or sees an access denied message
    cy.url().should('include', '/access-denied'); // Check if redirected to an access denied page
    cy.get('body').should('contain.text', 'Access Denied'); // Check if the error message is displayed
});
