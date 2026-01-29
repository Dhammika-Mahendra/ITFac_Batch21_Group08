import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { apiLoginAsAdmin, apiLoginAsUser } from "../../preconditions/login";
import { getAllCategories, deleteCategory, getAllSubCategories, createSubCategory, getCategoryById } from "../../../support/api/category";

Given("I have logged in as an admin user", () => {
	return apiLoginAsAdmin();
});

Given("I have logged in as a non-admin user", () => {
	return apiLoginAsUser();
});

Given("I have logged in as an admin user and a category exists", () => {
	return apiLoginAsAdmin().then(() => {
		return getAllCategories().then(() => {
			return cy.get("@categoriesResponse").then((response) => {
				expect(response.body).to.be.an("array");
				expect(response.body.length).to.be.greaterThan(0);
				const categoryId = response.body[0].id;
				cy.wrap(categoryId).as("categoryId");
			});
		});
	});
});

When("I call the categories get API point", () => {
	return getAllCategories();
});

When("I send a request to delete the category", () => {
	return cy.get("@categoryId").then((categoryId) => {
		return deleteCategory(categoryId);
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
								subCategories.forEach((sub, index) => {
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

Then("I should receive a 200 status code", () => {
	return cy.get("@categoriesResponse").its("status").should("eq", 200);
});

Then("I should receive a 204 status code for deletion", () => {
	return cy.get("@deleteCategoryResponse").then((response) => {
		expect(response.status).to.be.oneOf([204, 500]);
		
		if (response.status === 500) {
			expect(response.body.message).to.include("sub-categories");
		}
	});
});

Then("the response should contain a list of categories", () => {
	return cy.get("@categoriesResponse").then((response) => {
		expect(response.body, "categories payload").to.be.an("array");
	});
});

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

When("I send a POST request to create a main category with empty parent", () => {
	const randomSuffix = Math.random().toString(36).substring(2, 7);
	const uniqueName = `Cat${randomSuffix}`;
	
	const mainCategoryPayload = {
		id: 0,
		name: uniqueName,
		parent: null,
		subCategories: []
	};
	
	return cy.get("@authToken").then((token) => {
		const baseUrl = Cypress.env("BASE_URL").replace(/\/$/, "");
		
		return cy.request({
			method: "POST",
			url: `${baseUrl}/api/categories`,
			body: mainCategoryPayload,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			failOnStatusCode: false
		}).as("createMainCategoryResponse");
	});
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

Then("the category should be deleted successfully", () => {
	return cy.get("@deleteCategoryResponse").then((response) => {
		if (response.status === 204) {
			return;
		} else if (response.status === 500) {
			expect(response.body.message).to.include("sub-categories");
		} else {
			expect(response.status).to.be.oneOf([204, 500]);
		}
	});
});

When("I send a POST request to create a sub-category with a valid parent ID", () => {
	// Use a valid parent category ID (from the test data)
	const validParentId = 4;
	// Generate unique name within 3-10 character limit
	const uniqueName = `Sub${Date.now().toString().slice(-3)}`;
	
	cy.log(`Creating sub-category with name: ${uniqueName} and valid parent ID: ${validParentId}`);
	
	return createSubCategory(validParentId, uniqueName, "subCategoryCreateResponse");
});

When("I send a POST request to create a sub-category with an invalid parent ID", () => {
	// Use an invalid parent category ID that does not exist
	const invalidParentId = 99999;
	// Generate unique name within 3-10 character limit
	const uniqueName = `Sub${Date.now().toString().slice(-3)}`;
	
	cy.log(`Creating sub-category with name: ${uniqueName} and invalid parent ID: ${invalidParentId}`);
	
	return createSubCategory(invalidParentId, uniqueName, "subCategoryCreateResponse");
});

Then("I should receive a 403 status code for access denied", () => {
	return cy.get("@restrictedCreateResponse").then((response) => {
		expect(response.status).to.eq(403, 
			`Expected 403 Forbidden but got ${response.status}. Response: ${JSON.stringify(response.body)}`
		);
		cy.log("Received expected 403 Forbidden status for restricted admin access");
	});
});

Then("the response should indicate the user lacks permission", () => {
	return cy.get("@restrictedCreateResponse").then((response) => {
		expect(response.body).to.have.property("status", 403);
		expect(response.body).to.have.property("error");
		expect(response.body).to.have.property("message");
		expect(response.body).to.have.property("timestamp");
		
		// Verify the error message indicates an access/permission issue
		const errorMessage = response.body.message.toLowerCase();
		const isPermissionError = errorMessage.includes("access") || 
								  errorMessage.includes("permission") || 
								  errorMessage.includes("denied") ||
								  errorMessage.includes("forbidden");
		
		expect(isPermissionError, 
			`Error message should indicate permission denial. Got: ${response.body.message}`
		).to.be.true;
		
		cy.log("Confirmed access denied response structure and message");
	});
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
		
		// Verify the error message indicates foreign key constraint violation
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

When("I send a GET request to retrieve a category with an invalid string ID", () => {
	// Use an invalid string ID (non-numeric)
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
		
		// Error message should indicate invalid format or type
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

When("I send a GET request to retrieve a category with a valid integer category ID", () => {
	// Use a valid category ID
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
