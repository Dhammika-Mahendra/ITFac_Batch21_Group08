import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { apiLoginAsAdmin, apiLoginAsUser } from "../../preconditions/login";
import { getSalesPage, sellPlant, validateSalesResponse, validateSalesSortedByDate, validateSalesSortedByPlantName, validateSalesErrorResponse, validateSalesSortedByQuantity, validateSalesSortedByTotalPrice, validateSalesNotFoundResponse, getSaleById, validateSingleSaleResponse, deleteSale, validateDeleteSaleErrorResponse, createSaleWithoutPlant, validateMissingPlantErrorResponse, sellPlantWithoutAuth, validateUnauthorizedErrorResponse, validateNegativeQuantityErrorResponse, validateDecimalQuantityErrorResponse } from "../../../support/api/sales";

Given("I have logged in as an admin user", () => {
	return apiLoginAsAdmin();
});

When("I call the sales pagination API endpoint with page {int}, size {int} and sort {word} descending", (page, size, sortField) => {
	const query = { page, size, sort: [`${sortField},desc`] };
	return getSalesPage(query);
});

When("I call the sales pagination API endpoint with page {int}, size {int} and sort {word}", (page, size, sortField) => {
	const query = { page, size, sort: [sortField] };
	return getSalesPage(query);
});

When("I call the sales pagination API endpoint with page {int}, size {int}", (page, size) => {
	const query = { page, size };
	return getSalesPage(query);
});

Then("I should receive a 200 status code", () => {
	return cy.get("@salesPageResponse").its("status").should("eq", 200);
});

Then("I should receive a 500 status code", () => {
	return cy.get("@salesPageResponse").its("status").should("eq", 500);
});

Then("I should receive a 404 status code", () => {
	return cy.get("@sellPlantResponse").its("status").should("be.oneOf", [404, 500]);
});

Then("the response should contain a list of sales", () => {
	return cy.get("@salesPageResponse").then((response) => {
		return validateSalesResponse(response);
	});
});

Then("the sales should be sorted by soldAt in descending order", () => {
	return cy.get("@salesPageResponse").then((response) => {
		return validateSalesSortedByDate(response);
	});
});

Then("the sales should be sorted by plant name in alphabetical order", () => {
	return cy.get("@salesPageResponse").then((response) => {
		return validateSalesSortedByPlantName(response);
	});
});

Then("the response should contain an error message about unknown field", () => {
	return cy.get("@salesPageResponse").then((response) => {
		return validateSalesErrorResponse(response);
	});
});

Then("the sales should be sorted by quantity in ascending order", () => {
	return cy.get("@salesPageResponse").then((response) => {
		return validateSalesSortedByQuantity(response);
	});
});

Then("the sales should be sorted by total price in ascending order", () => {
	return cy.get("@salesPageResponse").then((response) => {
		return validateSalesSortedByTotalPrice(response);
	});
});

When("I attempt to create a sale for a non-existent plant", () => {
	return sellPlant(99999, 1, "sellPlantResponse");
});

Then("the response should contain a sale not found error message", () => {
	return cy.get("@sellPlantResponse").then((response) => {
		return validateSalesNotFoundResponse(response);
	});
});

Then("the delete response should contain a sale not found error message", () => {
	return cy.get("@deleteSaleResponse").then((response) => {
		return validateDeleteSaleErrorResponse(response);
	});
});

Given("I have retrieved a list of sales to get an existing sale ID", () => {
	return getSalesPage({ page: 0, size: 10 }).then(() => {
		return cy.get("@salesPageResponse").then((response) => {
			const sales = response.body.content;
			if (sales && sales.length > 0) {
				const firstSaleId = sales[0].id;
				return cy.wrap(firstSaleId).as("saleId");
			} else {
				throw new Error("No sales found in the response");
			}
		});
	});
});

When("I retrieve a single sale by ID", () => {
	return cy.get("@saleId").then((saleId) => {
		return getSaleById(saleId);
	});
});

Then("the response should contain a single sale with the correct ID", () => {
	return cy.get("@saleResponse").then((response) => {
		return cy.get("@saleId").then((expectedId) => {
			return validateSingleSaleResponse(response, expectedId);
		});
	});
});

When("I attempt to delete a non-existent sale", () => {
	const nonExistentSaleId = 99999;
	return deleteSale(nonExistentSaleId, "deleteSaleResponse");
});

Then("I should receive a 404 delete error response", () => {
	return cy.get("@deleteSaleResponse").its("status").should("be.oneOf", [404, 500]);
});

When("I attempt to create a sale without specifying a plant", () => {
	return createSaleWithoutPlant(10, "createSaleWithoutPlantResponse");
});

Then("I should receive a 500 error response", () => {
	return cy.get("@createSaleWithoutPlantResponse").its("status").should("eq", 500);
});

Then("the response should contain an error message about missing plant resource", () => {
	return cy.get("@createSaleWithoutPlantResponse").then((response) => {
		return validateMissingPlantErrorResponse(response);
	});
});

When("I attempt to create a sale without authenticating", () => {
	return sellPlantWithoutAuth(1, 40, "unauthenticatedSaleResponse");
});

Then("I should receive a 401 status code", () => {
	return cy.get("@unauthenticatedSaleResponse").its("status").should("eq", 401);
});

Then("the response should contain an unauthorized error message", () => {
	return cy.get("@unauthenticatedSaleResponse").then((response) => {
		return validateUnauthorizedErrorResponse(response);
	});
});

Given("I have logged in as a testuser", () => {
	return apiLoginAsUser();
});

When("I call the sales pagination API endpoint with page {int} and size {int}", (page, size) => {
	const query = { page, size };
	return getSalesPage(query, "invalidParamsResponse");
});

When("I attempt to retrieve sales without authenticating", () => {
	const baseUrl = Cypress.env("BASE_URL").replace(/\/$/, "");
	return cy.request({
		method: "GET",
		url: `${baseUrl}/api/sales/page`,
		qs: { page: 0, size: 10 },
		failOnStatusCode: false
	}).as("unauthenticatedSaleResponse");
});

When("I attempt to create a sale for plant {int} with quantity {int}", (plantId, quantity) => {
	return sellPlant(plantId, quantity, "negativeQuantityResponse");
});

Then("I should receive a 400 status code for negative quantity", () => {
	return cy.get("@negativeQuantityResponse").its("status").should("eq", 400);
});

Then("the response should contain an error message {string}", (expectedMessage) => {
	return cy.get("@negativeQuantityResponse").then((response) => {
		return validateNegativeQuantityErrorResponse(response, expectedMessage);
	});
});

When("I attempt to create a sale for plant {int} with decimal quantity {float}", (plantId, quantity) => {
	return sellPlant(plantId, quantity, "decimalQuantityResponse");
});

Then("I should receive a 500 status code for decimal quantity", () => {
	return cy.get("@decimalQuantityResponse").its("status").should("eq", 500);
});

Then("the response should contain a type conversion error message", () => {
	return cy.get("@decimalQuantityResponse").then((response) => {
		return validateDecimalQuantityErrorResponse(response);
	});
});
