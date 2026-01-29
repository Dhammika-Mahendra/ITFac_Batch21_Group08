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

export function sellPlant(plantId, payload, responseAlias = "sellPlantResponse") {
	if (!plantId && plantId !== 0) {
		throw new Error("plantId is required to sell a plant.");
	}
	if (!payload) {
		throw new Error("payload is required to sell a plant.");
	}
	return salesRequest({ method: "POST", path: `/api/sales/plant/${plantId}`, body: payload, alias: responseAlias });
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
	expect(response.body.content.length, "sales list length").to.be.greaterThan(0);
	return response;
}

export function validateSalesSortedByDate(response) {
	const sales = response.body.content;
	
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
	
	// Verify sales are sorted by plantName in alphabetical order (ascending)
	for (let i = 0; i < sales.length - 1; i++) {
		const currentName = sales[i].plantName ? sales[i].plantName.toLowerCase() : "";
		const nextName = sales[i + 1].plantName ? sales[i + 1].plantName.toLowerCase() : "";
		const comparison = currentName.localeCompare(nextName);
		expect(comparison, `Sales at index ${i} (${currentName}) should be <= sales at index ${i + 1} (${nextName})`).to.be.at.most(0);
	}
	return response;
}

export function validateSalesErrorResponse(response) {
	expect(response.status, "error status").to.equal(500);
	expect(response.body.message, "error message").to.exist;
	expect(response.body.message, "error message should mention unknown field").to.include("unknownField");
	return response;
}

export function validateSalesSortedByQuantity(response) {
	const sales = response.body.content;
	
	// Verify sales are sorted by quantity in ascending order (lowest to highest)
	for (let i = 0; i < sales.length - 1; i++) {
		const currentQuantity = sales[i].quantity ?? 0;
		const nextQuantity = sales[i + 1].quantity ?? 0;
		expect(
			currentQuantity,
			`Sales at index ${i} (quantity: ${currentQuantity}) should be <= sales at index ${i + 1} (quantity: ${nextQuantity})`,
		).to.be.at.most(nextQuantity);
	}
	return response;
}

export function validateSalesSortedByTotalPrice(response) {
	const sales = response.body.content;
	
	// Verify sales are sorted by totalPrice in ascending order (lowest to highest)
	for (let i = 0; i < sales.length - 1; i++) {
		const currentTotal = Number(sales[i].totalPrice ?? 0);
		const nextTotal = Number(sales[i + 1].totalPrice ?? 0);
		expect(
			currentTotal,
			`Sales at index ${i} (totalPrice: ${currentTotal}) should be <= sales at index ${i + 1} (totalPrice: ${nextTotal})`,
		).to.be.at.most(nextTotal);
	}
	return response;
}
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
					cy.log(`✗ Failed to restore plant ${plantId}: ${response.status}`);
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