import { Given, When, Then, Before, After } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pages/login";
import { salesPage } from "../../../support/pages/sales";
import { uiLoginAsAdmin, apiLoginAsAdmin } from "../../preconditions/login";

let initialSalesData = [];
let authToken = null;

const getBaseUrl = () => {
	const baseUrl = Cypress.env("BASE_URL");
	if (!baseUrl) {
		throw new Error("Missing BASE_URL env variable");
	}
	return baseUrl;
};

const authenticatedRequest = (method, url, body = null) => {
	return cy.get("@authToken").then((token) => {
		const options = {
			method,
			url,
			headers: {
				Authorization: `Bearer ${token}`
			},
			failOnStatusCode: false
		};
		if (body) {
			options.body = body;
		}
		return cy.request(options);
	});
};

Before({ tags: "@Sale_Admin_UI_10" }, () => {
	// Get auth token first
	apiLoginAsAdmin().then(() => {
		// Store initial sales data before test
		const baseUrl = getBaseUrl();
		authenticatedRequest("GET", `${baseUrl}/api/sales`).then((response) => {
			if (response.status === 200 && response.body) {
				initialSalesData = response.body;
				cy.log(`Captured ${initialSalesData.length} initial sales records`);
				if (initialSalesData.length > 0) {
					cy.log('Sample sale:', JSON.stringify(initialSalesData[0]));
				}
			}
		});
	});
});

After({ tags: "@Sale_Admin_UI_10" }, () => {
	// Restore initial state by recreating original sales records
	cy.log(`After hook: initialSalesData.length = ${initialSalesData.length}`);
	
	if (initialSalesData.length > 0) {
		const baseUrl = getBaseUrl();
		
		// Always get a fresh auth token for restoration
		return apiLoginAsAdmin().then(() => {
			return cy.get("@authToken").then((token) => {
				cy.log(`Restoring ${initialSalesData.length} initial sales records`);
				
				// Restore each original sale using the correct endpoint
				const restorePromises = initialSalesData.map((sale) => {
					// Extract plantId from the sale object
					const plantId = sale.plant?.id || sale.plantId;
					
					if (!plantId) {
						cy.log(`Warning: No plantId found for sale, skipping restoration`);
						return cy.wrap(null);
					}
					
					// Create sale parameters as query string (not body)
					const saleParams = {
						quantity: sale.quantity,
						totalPrice: sale.totalPrice,
						soldAt: sale.soldAt
					};
					
					return cy.request({
						method: "POST",
						url: `${baseUrl}/api/sales/plant/${plantId}`,
						headers: {
							Authorization: `Bearer ${token}`
						},
						qs: saleParams,
						failOnStatusCode: false
					}).then((response) => {
						if (response.status === 201 || response.status === 200) {
							cy.log(`✓ Restored sale for plant ${plantId}`);
						} else {
							cy.log(`✗ Failed to restore plant ${plantId}: ${response.status}`);
							cy.log(`Error details:`, JSON.stringify(response.body));
						}
					});
				});
				
				return Cypress.Promise.all(restorePromises);
			});
		});
	}
});

Given("I am logged in as admin", () => {
	loginPage.visitLoginPage();
	uiLoginAsAdmin();
});

Given("no sales exist in the system", () => {
	// Delete all sales to ensure none exist
	const baseUrl = getBaseUrl();
	authenticatedRequest("GET", `${baseUrl}/api/sales`).then((response) => {
		if (response.status === 200 && response.body && response.body.length > 0) {
			const deletePromises = response.body.map((sale) => 
				authenticatedRequest("DELETE", `${baseUrl}/api/sales/${sale.id}`)
			);
			return Cypress.Promise.all(deletePromises);
		}
	});
});

When("I navigate to the sales page", () => {
	salesPage.visitSalesPage();
});

Then("I should see {string} message displayed", (message) => {
	// Verify the page shows the expected empty state message
	cy.get('body').should('contain.text', message);
});
