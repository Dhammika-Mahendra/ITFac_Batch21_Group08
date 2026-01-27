import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { apiLoginAsAdmin, apiLoginAsUser } from "../../preconditions/login";

Given("I have logged in as an admin user", () => {
	return apiLoginAsAdmin();
});

Given("I have logged in as a non-admin user", () => {
    return apiLoginAsUser();
});

When("I call the categories get API point", () => {
	return cy.get("@authToken").then((token) => {
		return cy
			.request({
				method: "GET",
				url: `${Cypress.env("BASE_URL")}/api/categories`,
				headers: {
					Authorization: `Bearer ${token}`,
				},
				failOnStatusCode: false,
			})
			.as("categoriesResponse");
	});
});

Then("I should receive a 200 status code", () => {
	return cy.get("@categoriesResponse").its("status").should("eq", 200);
});

Then("the response should contain a list of categories", () => {
	return cy.get("@categoriesResponse").then((response) => {
		expect(response.body, "categories payload").to.be.an("array");
	});
});
