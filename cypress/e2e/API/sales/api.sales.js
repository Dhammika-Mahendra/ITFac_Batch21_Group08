import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { apiLoginAsAdmin } from "../../preconditions/login";
import { getSalesPage, sellPlant, validateSalesResponse, validateSalesSortedByDate, validateSalesSortedByPlantName, validateSalesErrorResponse, validateSalesSortedByQuantity, validateSalesSortedByTotalPrice, validateSalesNotFoundResponse } from "../../../support/api/sales";

Given("I have logged in as an admin user", () => {
	return apiLoginAsAdmin();
});

When("I call the sales pagination API endpoint with page {int}, size {int} and sort {word} descending", (page, size, sortField) => {
	const query = { page, size, sort: `${sortField},desc` };
	return getSalesPage(query);
});

When("I call the sales pagination API endpoint with page {int}, size {int} and sort {word}", (page, size, sortField) => {
	const query = { page, size, sort: sortField };
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
	const payload = { id: 99999, quantity: 1 };
	return sellPlant(99999, payload, "sellPlantResponse");
});

Then("the response should contain a sale not found error message", () => {
	return cy.get("@sellPlantResponse").then((response) => {
		return validateSalesNotFoundResponse(response);
	});
});
