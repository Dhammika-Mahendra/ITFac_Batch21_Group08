import { Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";
import { apiLoginAsAdmin, apiLoginAsUser } from "../../preconditions/login";
import { createCategory, getAllCategories, deleteCategory, updateCategory, getCategoryById, searchCategories } from "../../../support/api/category";

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

// @Cat_Admin_API_02 -----------------------------------------------

Given("category list exists", () => {
	return getAllCategories().then((response) => {
		expect(response.status, "get all categories status").to.eq(200);
		const categories = response.body;
		expect(categories, "categories payload").to.be.an("array").and.not.empty;
	});
});

let categoriesPage0 = null;
let categoriesPage1 = null;

When("I request categories with pagination parameters", () => {
	const page = 0;
	const size = 5;
	const sortField = "id";
	const sortDir = "asc";
	return searchCategories({ page, size, sortField, sortDir, responseAlias: "categoriesPageResponse" });
});

Then("I should receive a paginated list of categories", () => {
	return cy.get("@categoriesPageResponse").then((response) => {
		expect(response.status, "paginated categories status").to.eq(200);
		const categoriesPage = response.body;
		expect(categoriesPage.content, "paginated categories payload").to.be.an("array").and.have.length.of.at.most(5);
		categoriesPage0 = categoriesPage.content;
	});
});

// Additional steps for different pagination parameters

When("I request categories with pagination different parameters", () => {
	const page = 1;
	const size = 5;
	const sortField = "id";
	const sortDir = "asc";
	return searchCategories({ page, size, sortField, sortDir, responseAlias: "categoriesPageResponse1" });
});

Then("I should receive a different paginated list of categories", () => {
	return cy.get("@categoriesPageResponse1").then((response) => {
		expect(response.status, "paginated categories status").to.eq(200);
		const categoriesPage = response.body;
		expect(categoriesPage.content, "paginated categories payload").to.be.an("array").and.have.length.of.at.most(5);
		categoriesPage1 = categoriesPage.content;

		// a. Compare last element id of page 0 with first element id of page 1
		if (categoriesPage0 && categoriesPage0.length > 0 && categoriesPage1 && categoriesPage1.length > 0) {
			const lastIdPage0 = categoriesPage0[categoriesPage0.length - 1].id;
			const firstIdPage1 = categoriesPage1[0].id;
			expect(firstIdPage1, "last id of page 0").to.be.lessThan(lastIdPage0);
		}

		// b. Ensure content at page 0 is different than content at page 1
		expect(categoriesPage0, "page 0 content").to.not.deep.equal(categoriesPage1);
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

let lastCategory = null;
let parentId = null;
const editName = "MyCat";

Given("a category exists", () => {
	return getAllCategories().then((response) => {
		expect(response.status, "get all categories status").to.eq(200);
		const categories = response.body;
		expect(categories, "categories payload").to.be.an("array").and.not.empty;

		// Find the category with the highest id
		lastCategory = categories.reduce((max, cat) => (cat.id > max.id ? cat : max), categories[0]);
		expect(lastCategory, "last category").to.have.property("id");

		//find the parentId 
		const parentCategory = categories.find(cat => cat.name === lastCategory.parentName);
		parentId = parentCategory ? parentCategory.id : null;
	});
});

Then("I send a request to edit the category name", () => {
	let data = { name: editName, parentId: parentId };
	return updateCategory(lastCategory.id, data, "updateCategoryResponse");
});

Then("the category name should be updated successfully", () => {
	return cy.get("@updateCategoryResponse").then((response) => {
		expect(response.status, "update category status").to.eq(200);
		expect(response.body.name, "updated category name").to.eq(editName);

		// Revert the category name back to its original value for cleanup
		let revertData = { name: lastCategory.name, parentId: parentId};
		return updateCategory(lastCategory.id, revertData);
	});
});

// @Cat_Admin_API_05 -----------------------------------------------

When("I attempt to edit the category name with invalid data - short name",()=>{
	let data = { name: "ru", parentId: parentId };
	return updateCategory(lastCategory.id, data, "updateCategoryResponse");
});

Then("the system should reject the name update with a validation error", () => {
	return cy.get("@updateCategoryResponse").then((response) => {
		expect(response.status, "update category status").to.eq(500);
	});
});

When("When I attempt to edit the category name with invalid data - long name",()=>{
	let data = { name: "dragonflower daffadile", parentId: parentId };
	return updateCategory(lastCategory.id, data, "updateCategoryResponse");
});


// @Cat_Admin_API_06 -----------------------------------------------

Then("I send a request to delete the category", () => {
	return deleteCategory(lastCategory.id, "deleteCategoryResponse");
});

Then("the category should be deleted successfully", () => {
	return cy.get("@deleteCategoryResponse").then((response) => {
		expect(response.status, "delete category status").to.eq(204);

		//Revert by adding the category back
		let data = {"id":null,"name":lastCategory.name,"parent":{"id":parentId,"name":null,"parent":null}};
		return createCategory(data);
	});
});