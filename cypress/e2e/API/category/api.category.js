import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { apiLoginAsAdmin, apiLoginAsUser } from "../../preconditions/login";
import { createCategory, getAllCategories, deleteCategory } from "../../../support/api/category";

Given("I have logged in as an admin user", () => {
	return apiLoginAsAdmin();
});

Given("I have logged in as a non-admin user", () => {
    return apiLoginAsUser();
});

// @Cat_Admin_API_01 -----------------------------------------------

When("I call the categories get API point", () => {
	return getAllCategories();
});

Then("I should receive a 200 status code", () => {
	return cy.get("@categoriesResponse").its("status").should("eq", 200);
});

Then("the response should contain a list of categories", () => {
	return cy.get("@categoriesResponse").then((response) => {
		expect(response.body, "categories payload").to.be.an("array");

		//verify main categories exist (parentName = null)
		const mainCategories = response.body.filter(category => category.parentName === "-");
		expect(mainCategories.length, "main categories count").to.be.greaterThan(0);

		//verify subcategories exist (parentName != null)
		const subCategories = response.body.filter(category => category.parentName !== null);
		expect(subCategories.length, "subcategories count").to.be.greaterThan(0);
	});
});

// @Cat_Admin_API_03 -----------------------------------------------

When("I send a request to create a new category", () => {
	let data = {"id":null,"name":"Jannet","parent":{"id":13,"name":null,"parent":null}};
	return createCategory(data, "createCategoryResponse");
});

Then("the category should be created successfully", () => {
	return cy.get("@createCategoryResponse").then((response) => {
		expect(response.status, "create category status").to.eq(201);

		// Clean up: delete the created category
		const createdCategoryId = response.body.id;
		if (createdCategoryId) {
			return deleteCategory(createdCategoryId);
		}
	});
});