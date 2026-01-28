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