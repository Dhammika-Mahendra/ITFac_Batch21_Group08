const BASE_URL_ERROR = "Missing BASE_URL env variable. Configure it before running API tests.";
const AUTH_TOKEN_ERROR = "Missing @authToken. Call an API login helper before invoking sales APIs.";

function ensureBaseUrl() {
	const baseUrl = Cypress.env("BASE_URL");
	if (!baseUrl) {
		throw new Error(BASE_URL_ERROR);
	}
	return baseUrl.replace(/\/$/, "");
}

function normalizePath(path) {
	if (!path) {
		throw new Error("A relative API path is required.");
	}
	return path.startsWith("/") ? path : `/${path}`;
}

function salesRequest({
	method = "GET",
	path,
	body,
	qs,
	headers = {},
	alias = "salesResponse",
	failOnStatusCode = false,
}) {
	const baseUrl = ensureBaseUrl();
	const url = `${baseUrl}${normalizePath(path)}`;
	return cy.get("@authToken").then((token) => {
		if (!token) {
			throw new Error(AUTH_TOKEN_ERROR);
		}
		return cy
			.request({
				method,
				url,
				body,
				qs,
				headers: {
					Authorization: `Bearer ${token}`,
					...headers,
				},
				failOnStatusCode,
			})
			.as(alias);
	});
}

export function sellPlant(plantId, quantity, responseAlias = "sellPlantResponse") {
	if (!plantId && plantId !== 0) {
		throw new Error("plantId is required to sell a plant.");
	}
	if (!quantity && quantity !== 0) {
		throw new Error("quantity is required to sell a plant.");
	}
	return salesRequest({ method: "POST", path: `/api/sales/plant/${plantId}`, qs: { quantity }, alias: responseAlias });
}

export function getAllSales(responseAlias = "salesResponse") {
	return salesRequest({ path: "/api/sales", alias: responseAlias });
}

export function getSaleById(saleId, responseAlias = "saleResponse") {
	if (!saleId && saleId !== 0) {
		throw new Error("saleId is required to fetch a sale.");
	}
	return salesRequest({ path: `/api/sales/${saleId}`, alias: responseAlias });
}

export function deleteSale(saleId, responseAlias = "deleteSaleResponse") {
	if (!saleId && saleId !== 0) {
		throw new Error("saleId is required to delete a sale.");
	}
	return salesRequest({ method: "DELETE", path: `/api/sales/${saleId}`, alias: responseAlias });
}

export function getSalesPage(query = {}, responseAlias = "salesPageResponse") {
	return salesRequest({ path: "/api/sales/page", qs: query, alias: responseAlias });
}

export function validateSalesResponse(response) {
	expect(response.body.content, "sales payload").to.be.an("array");
	// Generic validation - accepts both empty and populated arrays
	expect(response.body, "response body should have pagination properties").to.have.property("content");
	expect(response.body, "response should have totalElements").to.have.property("totalElements");
	return response;
}

export function validateSalesSortedByDate(response) {
	const sales = response.body.content;
	
	if (!sales || sales.length === 0) {
		// Valid response with no data - skip sorting validation
		return response;
	}
	
	// Verify sales are sorted by soldAt in descending order (newest first)
	for (let i = 0; i < sales.length - 1; i++) {
		const currentDate = new Date(sales[i].soldAt).getTime();
		const nextDate = new Date(sales[i + 1].soldAt).getTime();
		expect(currentDate, `Sales at index ${i} should be >= sales at index ${i + 1} (descending order)`).to.be.at.least(nextDate);
	}
	return response;
}

export function validateSalesSortedByPlantName(response) {
	const sales = response.body.content;
	
	if (!sales || sales.length === 0) {
		// Valid response with no data - skip sorting validation
		return response;
	}
	
	// Verify sales are sorted by plantName in alphabetical order (ascending)
	for (let i = 0; i < sales.length - 1; i++) {
		const currentName = sales[i].plantName ? sales[i].plantName.toLowerCase() : "";
		const nextName = sales[i + 1].plantName ? sales[i + 1].plantName.toLowerCase() : "";
		const comparison = currentName.localeCompare(nextName);
		expect(comparison, `Sales should be sorted alphabetically`).to.be.at.most(0);
	}
	return response;
}

export function validateSalesErrorResponse(response) {
	expect(response.status, "error status").to.equal(500);
	expect(response.body.message, "error message").to.exist;
	expect(response.body.message, "error message should not be empty").to.not.be.empty;
	return response;
}

export function validateSalesSortedByQuantity(response) {
	const sales = response.body.content;
	
	if (!sales || sales.length === 0) {
		// Valid response with no data - skip sorting validation
		return response;
	}
	
	// Verify sales are sorted by quantity in ascending order (lowest to highest)
	for (let i = 0; i < sales.length - 1; i++) {
		const currentQuantity = sales[i].quantity ?? 0;
		const nextQuantity = sales[i + 1].quantity ?? 0;
		expect(currentQuantity, `Sales should be sorted by quantity in ascending order`).to.be.at.most(nextQuantity);
	}
	return response;
}

export function validateSalesSortedByTotalPrice(response) {
	const sales = response.body.content;
	
	if (!sales || sales.length === 0) {
		// Valid response with no data - skip sorting validation
		return response;
	}
	
	// Verify sales are sorted by totalPrice in ascending order (lowest to highest)
	for (let i = 0; i < sales.length - 1; i++) {
		const currentTotal = Number(sales[i].totalPrice ?? 0);
		const nextTotal = Number(sales[i + 1].totalPrice ?? 0);
		expect(currentTotal, `Sales should be sorted by total price in ascending order`).to.be.at.most(nextTotal);
	}
	return response;
}

function validateSalesNotFoundResponse(response) {
	expect(response.status, "error status").to.be.oneOf([404, 500]);
	expect(response.body.message, "error message").to.exist;
	expect(response.body.message, "error message should mention not found").to.include("not found");
	return response;
}

export function validateSingleSaleResponse(response, expectedId) {
	expect(response.status, "response status").to.equal(200);
	expect(response.body, "sale object").to.exist;
	expect(response.body.id, "sale ID").to.equal(expectedId);
	expect(response.body.id, "sale ID should be defined").to.not.be.undefined;
	return response;
}

export function validateDeleteSaleErrorResponse(response) {
	expect(response.status, "error status").to.be.oneOf([404, 500]);
	expect(response.body.message, "error message").to.exist;
	expect(response.body.message, "error message should mention not found").to.include("not found");
	return response;
}

export function createSaleWithoutPlant(quantity, responseAlias = "createSaleWithoutPlantResponse") {
	if (!quantity && quantity !== 0) {
		throw new Error("quantity is required to create a sale.");
	}
	return salesRequest({ method: "POST", path: "/api/sales/plant", qs: { quantity }, alias: responseAlias });
}

export function validateMissingPlantErrorResponse(response) {
	expect(response.status, "error status").to.equal(500);
	expect(response.body.message, "error message").to.exist;
	// The error can be either "No static resource" or "Request method 'POST' is not supported"
	const errorMsg = response.body.message;
	const isValidError = errorMsg.includes("No static resource") || errorMsg.includes("Request method") || errorMsg.includes("not supported");
	expect(isValidError, `Error message should indicate invalid endpoint or method`).to.be.true;
	return response;
}

export function sellPlantWithoutAuth(plantId, quantity, responseAlias = "unauthenticatedSaleResponse") {
	if (!plantId && plantId !== 0) {
		throw new Error("plantId is required to sell a plant.");
	}
	if (!quantity && quantity !== 0) {
		throw new Error("quantity is required to sell a plant.");
	}
	const baseUrl = ensureBaseUrl();
	const url = `${baseUrl}/api/sales/plant/${plantId}`;
	return cy
		.request({
			method: "POST",
			url,
			qs: { quantity },
			failOnStatusCode: false,
		})
		.as(responseAlias);
}

export function validateUnauthorizedErrorResponse(response) {
	expect(response.status, "error status").to.equal(401);
	expect(response.body.message, "error message").to.exist;
	expect(response.body.message, "error message should mention Unauthorized").to.include("Unauthorized");
	return response;
}

export function validateNegativeQuantityErrorResponse(response, expectedMessage) {
	expect(response.status, "error status").to.equal(400);
	expect(response.body.message, "error message").to.exist;
	expect(response.body.message, "error message should match").to.equal(expectedMessage);
	return response;
}

export function validateDecimalQuantityErrorResponse(response) {
	expect(response.status, "error status").to.equal(500);
	expect(response.body.message, "error message").to.exist;
	const errorMsg = response.body.message;
	const isValidError = errorMsg.includes("Failed to convert") && errorMsg.includes("java.lang.String") && errorMsg.includes("int");
	expect(isValidError, "Error message should indicate type conversion failure from String to int").to.be.true;
	return response;
}

export { validateSalesNotFoundResponse };

//sales UI
// Utility functions for sales data backup and restoration
let salesBackup = [];

export function backupSalesData() {
	return getAllSales().then(() => {
		return cy.get("@salesResponse").then((response) => {
			if (response.status === 200 && response.body) {
				salesBackup = response.body;
				cy.log(`Backed up ${salesBackup.length} sales records`);
			}
		});
	});
}

export function restoreSalesData() {
	cy.log(`Restoring ${salesBackup.length} sales records`);
	
	if (salesBackup.length === 0) {
		return cy.wrap(null);
	}
	
	const baseUrl = ensureBaseUrl();
	
	// Restore each sale using the correct endpoint format
	const restorePromises = salesBackup.map((sale) => {
		const plantId = sale.plant?.id || sale.plantId;
		
		if (!plantId) {
			cy.log(`Warning: No plantId found for sale, skipping`);
			return cy.wrap(null);
		}
		
		// Create sale parameters as query string
		const saleParams = {
			quantity: sale.quantity,
			totalPrice: sale.totalPrice,
			soldAt: sale.soldAt
		};
		
		return cy.get("@authToken").then((token) => {
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
					cy.log(`✗ Failed to restore plant ${plantId}: ${response.status} - ${JSON.stringify(response.body)}`);
				}
			});
		});
	});
	
	return Cypress.Promise.all(restorePromises);
}

export function deleteAllSales() {
	return getAllSales().then(() => {
		return cy.get("@salesResponse").then((response) => {
			if (response.status === 200 && response.body && response.body.length > 0) {
				const deletePromises = response.body.map((sale) => 
					deleteSale(sale.id)
				);
				return Cypress.Promise.all(deletePromises);
			}
		});
	});
}

// Create a test sale for UI testing
export function createTestSale() {
	// Use a valid plant ID (assuming plant ID 1 exists, adjust if needed)
	const plantId = 1;
	const payload = {
		quantity: 5,
		totalPrice: 50.00,
		soldAt: new Date().toISOString()
	};
	
	return salesRequest({ 
		method: "POST", 
		path: `/api/sales/plant/${plantId}`, 
		qs: payload, 
		alias: "testSaleResponse",
		failOnStatusCode: false
	}).then(() => {
		return cy.get("@testSaleResponse").then((response) => {
			if (response.status === 201 || response.status === 200) {
				cy.log(`Test sale created with ID: ${response.body.id}`);
				return cy.wrap(response.body).as("testSale");
			} else {
				cy.log(`Failed to create test sale: ${response.status} - ${JSON.stringify(response.body)}`);
				throw new Error(`Failed to create test sale: ${response.status}`);
			}
		});
	});
}
