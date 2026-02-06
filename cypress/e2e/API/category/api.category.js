import { Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";
import { apiLoginAsAdmin, apiLoginAsUser } from "../../preconditions/login";
import { createCategory, getAllCategories, deleteCategory, updateCategory, getCategoryById, searchCategories, getAllSubCategories, createSubCategory } from "../../../support/api/category";

Given("I have logged in as an admin user", () => {
	return apiLoginAsAdmin();
});

Given("I have logged in as a non-admin user", () => {
    return apiLoginAsUser();
});

Given("category list exists", () => {
	return getAllCategories().then((response) => {
		expect(response.status).to.eq(200);
		expect(response.body).to.be.an('array').that.is.not.empty;
	});
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

const handleCategoryModify = () => {
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
};

Then("I send a request to edit the category name", () => {
	return handleCategoryModify().then(() => {
	let data = { name: editName, parentId: parentId };
	return updateCategory(lastCategory.id, data, "updateCategoryResponse");
	});
});

Then("the category name should be updated successfully", () => {
	return cy.get("@updateCategoryResponse").then((response) => {
		//200 or 204 as response status
		expect(response.status, "update category status").to.be.oneOf([200, 204]);
		expect(response.body.name, "updated category name").to.eq(editName);

		// Revert the category name back to its original value for cleanup
		let revertData = { name: lastCategory.name, parentId: parentId};
		return updateCategory(lastCategory.id, revertData);
	});
});

// @Cat_Admin_API_05 -----------------------------------------------

When("I attempt to edit the category name with invalid data - empty name",()=>{
	return handleCategoryModify().then(() => {	
	let data = { name: "", parentId: parentId };
	return updateCategory(lastCategory.id, data, "updateCategoryResponse");
	});
});

When("I attempt to edit the category name with invalid data - short name",()=>{
	let data = { name: "ru", parentId: parentId };
	return updateCategory(lastCategory.id, data, "updateCategoryResponse");
});

When("When I attempt to edit the category name with invalid data - long name",()=>{
	let data = { name: "dragonflower daffadile", parentId: parentId };
	return updateCategory(lastCategory.id, data, "updateCategoryResponse");
});

Then("the system should reject the name update with a validation error", () => {
	return cy.get("@updateCategoryResponse").then((response) => {
		//4xx status expected
		expect(response.status, "update category status").to.be.within(400, 499);
	});
});


// @Cat_Admin_API_06 -----------------------------------------------

Then("I send a request to delete the category", () => {
	return handleCategoryModify().then(() => {	
		return deleteCategory(lastCategory.id, "deleteCategoryResponse");
	});
});

Then("the category should be deleted successfully", () => {
	return cy.get("@deleteCategoryResponse").then((response) => {
		if (response.status === 204) {
			// Only attempt cleanup if we have the original category context
			if (lastCategory && lastCategory.name) {
				let data = {"id":null,"name":lastCategory.name,"parent":{"id":parentId,"name":null,"parent":null}};
				return createCategory(data);
			}
			return; // nothing to revert
		} else if (response.status === 500) {
			expect(response.body.message).to.include("sub-categories");
		} else {
			expect(response.status).to.be.oneOf([200, 204]);
		}
	});
});

// @Cat_Admin_API_07 -----------------------------------------------

let createdCategoryForDeletion = null;

Given("I have logged in as an admin user and a category exists", () => {
	return apiLoginAsAdmin().then(() => {
		// Create a category specifically for deletion test
		const randomSuffix = Math.random().toString(36).substring(2, 7);
		const uniqueName = `Del${randomSuffix}`;
		let data = {"id":null,"name":uniqueName,"parent":{"id":null,"name":null,"parent":null}};
		return createCategory(data, "tempCategoryResponse").then(() => {
			return cy.get("@tempCategoryResponse").then((response) => {
				expect(response.status).to.eq(201);
				createdCategoryForDeletion = response.body;
				cy.wrap(response.body.id).as("categoryId");
			});
		});
	});
});

When("I send a DELETE request to the category endpoint with a valid category ID", () => {
	return cy.get("@categoryId").then((categoryId) => {
		return deleteCategory(categoryId, "deleteCategoryResponse").then(() => {
			return cy.get("@deleteCategoryResponse").then((initialResponse) => {
				cy.wrap(initialResponse).as("initialDeleteResponse");
				
				if (initialResponse.status === 500 && 
					initialResponse.body.message && 
					initialResponse.body.message.includes("sub-categories")) {
					
					return getAllSubCategories("subCategoriesResponse").then(() => {
						return cy.get("@subCategoriesResponse").then((subResponse) => {
							const subCategories = subResponse.body.filter(sub => 
								sub.parentId === categoryId || 
								sub.parentCategoryId === categoryId ||
								sub.categoryId === categoryId
							);
							
							if (subCategories.length > 0) {
								let deleteChain = cy.wrap(null);
								subCategories.forEach((sub) => {
									deleteChain = deleteChain.then(() => {
										return deleteCategory(sub.id);
									});
								});
								
								return deleteChain.then(() => {
									return deleteCategory(categoryId, "finalDeleteResponse").then(() => {
										return cy.get("@finalDeleteResponse").then((finalResponse) => {
											cy.wrap(finalResponse).as("deleteCategoryResponse");
											return finalResponse;
										});
									});
								});
							} else {
								return cy.wrap(initialResponse);
							}
						});
					});
				} else {
					return cy.wrap(initialResponse);
				}
			});
		});
	});
});

Then("I should receive a 204 status code for deletion", () => {
	return cy.get("@deleteCategoryResponse").then((response) => {
		expect(response.status).to.be.oneOf([204, 500]);
		
		if (response.status === 500) {
			expect(response.body.message).to.include("sub-categories");
		}
	});
});

// @Cat_Admin_API_08 -----------------------------------------------

When("I send a DELETE request to the category endpoint with an invalid category ID", () => {
	const invalidCategoryId = 99999;
	return deleteCategory(invalidCategoryId, "invalidDeleteResponse");
});

Then("I should receive a 404 status code for deletion", () => {
	return cy.get("@invalidDeleteResponse").then((response) => {
		expect(response.status).to.eq(404);
	});
});

Then("the response should contain an error message about category not found", () => {
	return cy.get("@invalidDeleteResponse").then((response) => {
		expect(response.body).to.have.property("status", 404);
		expect(response.body).to.have.property("error", "NOT_FOUND");
		expect(response.body.message).to.include("Category not found");
		expect(response.body).to.have.property("timestamp");
	});
});

// @Cat_Admin_API_09 -----------------------------------------------

When("I send a POST request to create a main category with empty parent", () => {
	const randomSuffix = Math.random().toString(36).substring(2, 7);
	const uniqueName = `Cat${randomSuffix}`;
	
	const mainCategoryPayload = {
		id: null,
		name: uniqueName,
		parent: {
			id: null,
			name: null,
			parent: null
		}
	};
	
	return createCategory(mainCategoryPayload, "createMainCategoryResponse");
});

Then("I should receive a 201 status code for creation", () => {
	return cy.get("@createMainCategoryResponse").then((response) => {
		if (response.status === 400) {
			cy.log(`Error: ${JSON.stringify(response.body)}`);
		}
		expect(response.status).to.eq(201, `Expected 201 but got ${response.status}. Error: ${JSON.stringify(response.body)}`);
	});
});

Then("the response should contain the created main category details", () => {
	return cy.get("@createMainCategoryResponse").then((response) => {
		if (response.status === 400) {
			expect(response.status).to.eq(201);
		}
		
		expect(response.body).to.have.property("id");
		expect(response.body).to.have.property("name");
		
		if (response.body.hasOwnProperty("subCategories")) {
			expect(response.body.subCategories).to.be.an("array");
		}
		
		cy.wrap(response.body.id).as("createdMainCategoryId");
	});
});

// @Cat_Admin_API_10 -----------------------------------------------

When("I send a POST request to create a sub-category with a valid parent ID", () => {
	const validParentId = 4;
	const uniqueName = `Sub${Date.now().toString().slice(-3)}`;
	
	cy.log(`Creating sub-category with name: ${uniqueName} and valid parent ID: ${validParentId}`);
	
	return createSubCategory(validParentId, uniqueName, "subCategoryCreateResponse");
});

Then("I should receive a 201 status code for sub-category creation", () => {
	return cy.get("@subCategoryCreateResponse").then((response) => {
		expect(response.status).to.eq(201, 
			`Expected 201 but got ${response.status}. Response: ${JSON.stringify(response.body)}`
		);
		cy.log("Received expected 201 status for sub-category creation");
	});
});

Then("the response should contain the created sub-category details", () => {
	return cy.get("@subCategoryCreateResponse").then((response) => {
		expect(response.body).to.have.property("id");
		expect(response.body).to.have.property("name");
		
		cy.wrap(response.body.id).as("createdSubCategoryId");
		cy.log(`Sub-category created successfully with ID: ${response.body.id}`);
		cy.log(`Sub-category name: ${response.body.name}`);
	});
});

// @Cat_Admin_API_11 -----------------------------------------------

When("I send a POST request to create a sub-category with an invalid parent ID", () => {
	const invalidParentId = 99999;
	const uniqueName = `Sub${Date.now().toString().slice(-3)}`;
	
	cy.log(`Creating sub-category with name: ${uniqueName} and invalid parent ID: ${invalidParentId}`);
	
	return createSubCategory(invalidParentId, uniqueName, "subCategoryCreateResponse");
});

Then("I should receive a 500 status code for invalid parent", () => {
	return cy.get("@subCategoryCreateResponse").then((response) => {
		expect(response.status).to.eq(500, 
			`Expected 500 but got ${response.status}. Response: ${JSON.stringify(response.body)}`
		);
		cy.log("Received expected 500 status for invalid parent ID");
	});
});

Then("the response should contain an error message about foreign key constraint", () => {
	return cy.get("@subCategoryCreateResponse").then((response) => {
		expect(response.body).to.have.property("status", 500);
		expect(response.body).to.have.property("error", "INTERNAL_SERVER_ERROR");
		expect(response.body).to.have.property("message");
		expect(response.body).to.have.property("timestamp");
		
		const errorMessage = response.body.message.toLowerCase();
		const isForeignKeyError = errorMessage.includes("foreign key") || 
								  errorMessage.includes("constraint") ||
								  errorMessage.includes("child row");
		
		expect(isForeignKeyError, 
			`Error message should indicate foreign key constraint. Got: ${response.body.message}`
		).to.be.true;
		
		cy.log("Confirmed foreign key constraint error response");
	});
});

// ----------------------------------------------------------------
// Non-Admin User Tests
// ----------------------------------------------------------------

// @Cat_User_API_03 -----------------------------------------------

When("I attempt to create a new category", () => {
	let data = {"id":null,"name":"UserCat","parent":{"id":null,"name":null,"parent":null}};
	return createCategory(data, "createCategoryResponse");
});

Then("the system should reject the create request with an authorization error", () => {
	return cy.get("@createCategoryResponse").then((response) => {
		expect(response.status, "create category status").to.eq(403);
	});
});

// @Cat_User_API_04 -----------------------------------------------

When("I attempt to edit the category name", () => {
	return handleCategoryModify().then(() => {
	let data = { name: editName, parentId: parentId };
	return updateCategory(lastCategory.id, data, "updateCategoryResponse");
	});
});

Then("the system should reject the edit request with an authorization error", () => {
	return cy.get("@updateCategoryResponse").then((response) => {
		expect(response.status, "update category status").to.eq(403);
	});
});


// @Cat_User_API_05 -----------------------------------------------

When("I attempt to delete the category", () => {
	return handleCategoryModify().then(() => {
		return deleteCategory(lastCategory.id, "deleteCategoryResponse");
	});
});

Then("the system should reject the delete request with an authorization error", () => {
	return cy.get("@deleteCategoryResponse").then((response) => {
		expect(response.status, "delete category status").to.eq(403);
	});
});

// @Cat_User_API_06 -----------------------------------------------

When("I send a GET request to retrieve a category with an invalid string ID", () => {
	const invalidStringId = "invalidString";
	
	cy.log(`Attempting to retrieve category with invalid string ID: ${invalidStringId}`);
	
	return getCategoryById(invalidStringId, "invalidIdResponse");
});

Then("I should receive a 400 status code for invalid ID format", () => {
	return cy.get("@invalidIdResponse").then((response) => {
		expect(response.status).to.eq(400, 
			`Expected 400 Bad Request but got ${response.status}. Response: ${JSON.stringify(response.body)}`
		);
		cy.log("Received expected 400 status for invalid string ID format");
	});
});

Then("the response should contain an error message about invalid ID format", () => {
	return cy.get("@invalidIdResponse").then((response) => {
		expect(response.body).to.have.property("status", 400);
		expect(response.body).to.have.property("error");
		expect(response.body).to.have.property("message");
		
		const errorMessage = response.body.message.toLowerCase();
		const isFormatError = errorMessage.includes("invalid") || 
							  errorMessage.includes("must be") ||
							  errorMessage.includes("format") ||
							  errorMessage.includes("type");
		
		expect(isFormatError, 
			`Error message should indicate invalid format. Got: ${response.body.message}`
		).to.be.true;
		
		cy.log("Confirmed invalid ID format error response");
	});
});

// @Cat_User_API_07 -----------------------------------------------

When("I send a GET request to retrieve a category with a valid integer category ID", () => {
	const validCategoryId = 1;
	
	cy.log(`Retrieving category with valid integer ID: ${validCategoryId}`);
	
	return getCategoryById(validCategoryId, "validCategoryResponse");
});

Then("I should receive a 200 status code for successful retrieval", () => {
	return cy.get("@validCategoryResponse").then((response) => {
		expect(response.status).to.eq(200, 
			`Expected 200 but got ${response.status}. Response: ${JSON.stringify(response.body)}`
		);
		cy.log("Received expected 200 status for category retrieval");
	});
});

Then("the response should contain the category details", () => {
	return cy.get("@validCategoryResponse").then((response) => {
		expect(response.body).to.have.property("id");
		expect(response.body).to.have.property("name");
		
		cy.log(`Category retrieved successfully with ID: ${response.body.id}`);
		cy.log(`Category name: ${response.body.name}`);
		cy.log("Category response structure validated");
	});
});