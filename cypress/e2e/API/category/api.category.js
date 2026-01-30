import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { apiLoginAsAdmin, apiLoginAsUser } from "../../preconditions/login";
import { createCategory, getAllCategories, deleteCategory, updateCategory, getCategoryById } from "../../../support/api/category";

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

const mainCatName = "Gold";

When("I send a request to create a new main category", () => {
	let data = {"id":null,"name":mainCatName,"parent":{"id":null,"name":null,"parent":null}};
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

// @Cat_Admin_API_04 -----------------------------------------------

let originalCategory = null;
let updatedName = "Corn";

// Retrieve all categories and select the one with the highest id
Given("a category exists", () => {
	return getAllCategories().then((response) => {
		expect(response.status, "get all categories status").to.eq(200);
		const categories = response.body;
		expect(categories, "categories array").to.be.an("array").and.not.empty;

		// Find the category with the highest id
		originalCategory = categories.reduce((max, cat) => (cat.id > max.id ? cat : max), categories[0]);
		expect(originalCategory, "original category").to.have.property("id");
	});
});

Then("I send a request to edit the category name", () => {
	const data = { name: updatedName, parentId: originalCategory.parentId || null };
	return updateCategory(originalCategory.id, data, "updateCategoryResponse");
});

Then("the category name should be updated successfully", () => {
	return cy.get("@updateCategoryResponse").then((response) => {
		expect(response.status, "update category status").to.eq(200);
		expect(response.body.name, "updated category name").to.eq(updatedName);

		// Revert the category name back to its original value for cleanup
		const revertData = { name: originalCategory.name, parentId: originalCategory.parentId || null };
		return updateCategory(originalCategory.id, revertData);
	});
});

// @Cat_Admin_API_06 -----------------------------------------------

Then("I send a request to delete the category", () => {
	return deleteCategory(catId, "deleteCategoryResponse");
});

Then("the category should be deleted successfully", () => {
	return cy.get("@deleteCategoryResponse").then((response) => {
		expect(response.status, "delete category status").to.eq(200);

		//Revert by adding the category back
		let data = {"id":null,"name":initialName,"parent":{"id":parentId,"name":null,"parent":null}};
		return createCategory(data);
	});
});