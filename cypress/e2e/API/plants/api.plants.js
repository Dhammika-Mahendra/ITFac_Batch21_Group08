import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { apiLoginAsAdmin, apiLoginAsUser } from "../../preconditions/login";
import { createPlant, getAllPlants, deletePlant, updatePlant, getPlantById, searchPlants, getPlantsByCategory } from "../../../support/api/plants";
import { getAllCategories, updateCategory } from "../../../support/api/category";

// Login steps
Given("I have logged in as an admin user", () => {
    return apiLoginAsAdmin();
});

Given("I have logged in as a regular user", () => {
    return apiLoginAsUser();
});

// @Plant_Admin_API_01 -----------------------------------------------

When("I call the plants get API endpoint", () => {
    return getAllPlants();
});

Then("I should receive a 200 status code for plants", () => {
    return cy.get("@plantsResponse").its("status").should("eq", 200);
});

Then("the response should contain a plants array", () => {
    return cy.get("@plantsResponse").then((response) => {
        // Handle both direct array and paginated response
        if (Array.isArray(response.body)) {
            expect(response.body, "plants array").to.be.an("array");
        } else {
            expect(response.body, "plants payload").to.have.property("content");
            expect(response.body.content, "plants array").to.be.an("array");
        }
    });
});

Then("the response should contain pagination details", () => {
    return cy.get("@plantsResponse").then((response) => {
        // Only check pagination if response is paginated (not a direct array)
        if (!Array.isArray(response.body)) {
            expect(response.body, "pagination details").to.have.property("totalPages");
            expect(response.body, "pagination details").to.have.property("totalElements");
            expect(response.body, "page metadata").to.have.property("pageable");
        } else {
            cy.log("API returns direct array - pagination details not applicable");
        }
    });
});

// @Plant_Admin_API_02 -----------------------------------------------

When("I attempt to create a plant with negative price", () => {
    const invalidPlant = {
        name: "Test Plant",
        categoryId: 10,
        price: -10,
        quantity: 5
    };
    return createPlant(invalidPlant, "createPlantResponse");
});

Then("I should receive a 400 status code for plant creation", () => {
    return cy.get("@createPlantResponse").its("status").should("eq", 400);
});

Then("the response should contain price validation error message", () => {
    return cy.get("@createPlantResponse").then((response) => {
        const errorMessage = JSON.stringify(response.body).toLowerCase();
        expect(errorMessage, "error message").to.include("price");
    });
});

// @Plant_Admin_API_03 -----------------------------------------------

let testCategory = null;
const updatedCategoryName = "Flowers";

Given("a category exists for plant testing", () => {
    return getAllCategories().then((response) => {
        expect(response.status, "get all categories status").to.eq(200);
        const categories = response.body;
        expect(categories, "categories payload").to.be.an("array").and.not.empty;
        testCategory = categories[0];
    });
});

When("I send a request to update the category name", () => {
    const payload = { name: updatedCategoryName, parentId: null };
    return updateCategory(testCategory.id, payload, "updateCategoryResponse");
});

Then("the category update should be successful with 200 status", () => {
    return cy.get("@updateCategoryResponse").its("status").should("eq", 200);
});

Then("the category name should be updated in response", () => {
    return cy.get("@updateCategoryResponse").then((response) => {
        expect(response.body.name, "updated category name").to.eq(updatedCategoryName);

        // Revert the category name back
        const revertPayload = { name: testCategory.name, parentId: null };
        return updateCategory(testCategory.id, revertPayload);
    });
});

// @Plant_Admin_API_04 -----------------------------------------------

let testPlant = null;
const updatedPlantData = {
    name: "Updated Plant",
    categoryId: 2,
    price: 200,
    quantity: 15
};

Given("a plant exists for testing", () => {
    return getAllPlants().then((response) => {
        expect(response.status, "get all plants status").to.eq(200);
        const plants = Array.isArray(response.body) ? response.body : response.body.content;
        expect(plants, "plants payload").to.be.an("array").and.not.empty;
        testPlant = plants[0];
    });
});

When("I send a request to update the plant details", () => {
    const payload = {
        name: updatedPlantData.name,
        categoryId: testPlant.categoryId || updatedPlantData.categoryId,
        price: updatedPlantData.price,
        quantity: updatedPlantData.quantity
    };
    return updatePlant(testPlant.id, payload, "updatePlantResponse");
});

Then("the plant update should be successful with 200 status", () => {
    return cy.get("@updatePlantResponse").its("status").should("eq", 200);
});

Then("the plant details should be updated in database", () => {
    return cy.get("@updatePlantResponse").then((response) => {
        expect(response.body.name, "updated plant name").to.eq(updatedPlantData.name);
        expect(response.body.price, "updated plant price").to.eq(updatedPlantData.price);
        expect(response.body.quantity, "updated plant quantity").to.eq(updatedPlantData.quantity);

        // Revert the plant back to original values
        const revertPayload = {
            name: testPlant.name,
            categoryId: testPlant.categoryId,
            price: testPlant.price,
            quantity: testPlant.quantity
        };
        return updatePlant(testPlant.id, revertPayload);
    });
});

// @Plant_Admin_API_05 -----------------------------------------------

let plantToDelete = null;

Given("a plant exists for deletion testing", () => {
    // Create a plant specifically for deletion
    const newPlant = {
        name: "DeleteMe " + Date.now(),
        categoryId: 10, // Use a valid Category (Tulip - Sub Category of Red)
        price: 150.00,
        quantity: 25
    };
    return createPlant(newPlant, "createPlantForDeletion").then((response) => {
        if (response.status !== 201) {
            cy.log("FAILED TO CREATE PLANT FOR DELETION. Status: " + response.status);
            cy.log("Response Body: " + JSON.stringify(response.body));
            console.error("Response Body: ", response.body);
        }
        expect(response.status, "create plant status").to.eq(201);
        plantToDelete = response.body;
    });
});

When("I send a DELETE request to remove the plant", () => {
    return deletePlant(plantToDelete.id, "deletePlantResponse");
});

Then("the plant deletion should be successful", () => {
    return cy.get("@deletePlantResponse").then((response) => {
        expect(response.status, "delete plant status").to.be.oneOf([200, 204]);
    });
});

Then("the plant should be removed from database", () => {
    // Verify the plant no longer exists by trying to get it
    return getPlantById(plantToDelete.id, "verifyDeletedPlant").then((response) => {
        expect(response.status, "get deleted plant status").to.be.oneOf([404, 500]);
    });
});

// @Plant_Admin_API_06 -----------------------------------------------

let firstCategoryId = null;
let secondCategoryId = null;

Given("plants with different categories exist in database", () => {
    return getAllCategories().then((response) => {
        expect(response.status, "get categories status").to.eq(200);
        const categories = response.body;
        expect(categories, "categories").to.be.an("array").and.have.length.at.least(2);
        firstCategoryId = categories[0].id;
        secondCategoryId = categories[1].id;
    });
});

When("I filter plants by first category", () => {
    return getPlantsByCategory(firstCategoryId, "firstCategoryPlants");
});

Then("I should receive plants only from first category", () => {
    return cy.get("@firstCategoryPlants").then((response) => {
        expect(response.status, "filter status").to.eq(200);
        const plants = Array.isArray(response.body) ? response.body : (response.body.content || response.body);
        if (Array.isArray(plants) && plants.length > 0) {
            plants.forEach((plant) => {
                expect(plant.category.id, "plant category id").to.eq(firstCategoryId);
            });
        }
    });
});

When("I filter plants by second category", () => {
    return getPlantsByCategory(secondCategoryId, "secondCategoryPlants");
});

Then("I should receive plants only from second category", () => {
    return cy.get("@secondCategoryPlants").then((response) => {
        expect(response.status, "filter status").to.eq(200);
        const plants = Array.isArray(response.body) ? response.body : (response.body.content || response.body);
        if (Array.isArray(plants) && plants.length > 0) {
            plants.forEach((plant) => {
                expect(plant.category.id, "plant category id").to.eq(secondCategoryId);
            });
        }
    });
});

// @Plant_User_API_01 (already covered by shared steps above)

// @Plant_User_API_02 -----------------------------------------------

When("I attempt to create a new plant as regular user", () => {
    const newPlant = {
        name: "UserAccess " + Date.now(),
        categoryId: 10,
        price: 150.00,
        quantity: 25
    };
    return createPlant(newPlant, "userCreatePlantResponse");
});

Then("I should receive a 403 Forbidden status code", () => {
    return cy.get("@userCreatePlantResponse").its("status").should("eq", 403);
});

Then("the response should indicate access denied", () => {
    return cy.get("@userCreatePlantResponse").then((response) => {
        expect(response.status, "forbidden status").to.eq(403);
    });
});

// @Plant_User_API_03 -----------------------------------------------

let existingPlant = null;

Given("a plant exists in the system", () => {
    return getAllPlants().then((response) => {
        expect(response.status, "get plants status").to.eq(200);
        const plants = Array.isArray(response.body) ? response.body : (response.body.content || response.body);
        expect(plants, "plants array").to.be.an("array").and.not.empty;
        existingPlant = plants[0];
    });
});

When("I attempt to update plant details as regular user", () => {
    const payload = {
        name: "Updated by User",
        categoryId: existingPlant.categoryId,
        price: 150,
        quantity: 20
    };
    return updatePlant(existingPlant.id, payload, "userUpdatePlantResponse");
});

Then("I should receive a 403 Forbidden status for update", () => {
    return cy.get("@userUpdatePlantResponse").its("status").should("eq", 403);
});

Then("the response should indicate insufficient permissions", () => {
    return cy.get("@userUpdatePlantResponse").then((response) => {
        expect(response.status, "forbidden status").to.eq(403);
    });
});

// @Plant_User_API_04 -----------------------------------------------

When("I attempt to delete plant as regular user", () => {
    return deletePlant(existingPlant.id, "userDeletePlantResponse");
});

Then("I should receive a 403 Forbidden status for deletion", () => {
    return cy.get("@userDeletePlantResponse").its("status").should("eq", 403);
});

Then("the response should indicate access denied for deletion", () => {
    return cy.get("@userDeletePlantResponse").then((response) => {
        expect(response.status, "forbidden status").to.eq(403);
    });
});

// @Plant_User_API_05 -----------------------------------------------

When("I filter plants by first category as user", () => {
    return getPlantsByCategory(firstCategoryId, "firstCategoryPlants");
});

When("I filter plants by second category as user", () => {
    return getPlantsByCategory(secondCategoryId, "secondCategoryPlants");
});

// @Plant_User_API_06 -----------------------------------------------

Given("multiple plants with different prices exist", () => {
    return getAllPlants().then((response) => {
        expect(response.status, "get plants status").to.eq(200);
        const plants = Array.isArray(response.body) ? response.body : (response.body.content || response.body);
        expect(plants, "plants array").to.be.an("array").and.have.length.at.least(2);
    });
});

When("I sort plants by price in ascending order", () => {
    return searchPlants({ sortBy: "price", order: "asc", responseAlias: "plantsAscPrice" });
});

Then("plants should be sorted by price low to high", () => {
    return cy.get("@plantsAscPrice").then((response) => {
        expect(response.status, "sort status").to.eq(200);
        const plants = Array.isArray(response.body) ? response.body : (response.body.content || response.body);
        if (Array.isArray(plants) && plants.length > 1) {
            for (let i = 0; i < plants.length - 1; i++) {
                expect(plants[i].price, "price order").to.be.at.most(plants[i + 1].price);
            }
        }
    });
});

When("I sort plants by price in descending order", () => {
    return searchPlants({ sortBy: "price", order: "desc", responseAlias: "plantsDescPrice" });
});

Then("plants should be sorted by price high to low", () => {
    return cy.get("@plantsDescPrice").then((response) => {
        expect(response.status, "sort status").to.eq(200);
        const plants = Array.isArray(response.body) ? response.body : (response.body.content || response.body);
        if (Array.isArray(plants) && plants.length > 1) {
            for (let i = 0; i < plants.length - 1; i++) {
                expect(plants[i].price, "price order").to.be.at.least(plants[i + 1].price);
            }
        }
    });
});

// @Plant_User_API_07 -----------------------------------------------

Given("multiple plants with different quantities exist", () => {
    return getAllPlants().then((response) => {
        expect(response.status, "get plants status").to.eq(200);
        const plants = Array.isArray(response.body) ? response.body : (response.body.content || response.body);
        expect(plants, "plants array").to.be.an("array").and.have.length.at.least(2);
    });
});

When("I sort plants by quantity in descending order", () => {
    return searchPlants({ sortBy: "quantity", order: "desc", responseAlias: "plantsDescQuantity" });
});

Then("plants should be sorted by quantity from highest to lowest", () => {
    return cy.get("@plantsDescQuantity").then((response) => {
        expect(response.status, "sort status").to.eq(200);
        const plants = Array.isArray(response.body) ? response.body : (response.body.content || response.body);
        if (Array.isArray(plants) && plants.length > 1) {
            for (let i = 0; i < plants.length - 1; i++) {
                expect(plants[i].quantity, "quantity order").to.be.at.least(plants[i + 1].quantity);
            }
        }
    });
});

// @Plant_User_API_08 -----------------------------------------------

let validCategoryId = null;

Given("a valid category with plants exists", () => {
    return getAllCategories().then((response) => {
        expect(response.status, "get categories status").to.eq(200);
        const categories = response.body;
        expect(categories, "categories").to.be.an("array").and.not.empty;
        validCategoryId = categories.find(cat => cat.id)?.id || categories[0].id;
    });
});

When("I send a GET request to retrieve plants by category ID", () => {
    return getPlantsByCategory(validCategoryId, "plantsByCategoryResponse");
});

Then("I should receive a 200 status code for plants by category", () => {
    return cy.get("@plantsByCategoryResponse").its("status").should("eq", 200);
});

Then("the response should contain plants from the specified category", () => {
    return cy.get("@plantsByCategoryResponse").then((response) => {
        expect(response.status, "status").to.eq(200);
        const plants = Array.isArray(response.body) ? response.body : (response.body.content || response.body);
        expect(plants, "plants array").to.be.an("array");
        
        if (plants.length > 0) {
            plants.forEach((plant) => {
                expect(plant, "plant object").to.have.property("category");
                expect(plant.category.id, "category id").to.eq(validCategoryId);
            });
        }
    });
});
