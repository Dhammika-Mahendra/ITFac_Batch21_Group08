import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pages/login";
import { uiLoginAsAdmin } from "../../preconditions/login";
import { categoriesPage } from "../../../support/pages/categories";

Given("I am logged in as an admin user", () => {
    loginPage.visitLoginPage();
    uiLoginAsAdmin();
});

// @Cat_Admin_UI_01 -----------------------------------------------------

When("I click the Categories menu option",() => {
    categoriesPage.clickCategoriesMenu();
});

Then("I should see a table of list of all categories", () => {
    categoriesPage.categoryTableRows.should('have.length.greaterThan', 0);
    //verify that the second <td> elements are not empty for each <tr>
    categoriesPage.categoryTableRows.each(($row) => {
        cy.wrap($row).find('td').eq(1).invoke('text').should('not.be.empty');
    });
    
});

// @Cat_Admin_UI_02 -----------------------------------------------------

When("I see a pagination control",()=>{
    categoriesPage.paginationControls.should('be.visible');
})

    // page 1
When("I click a pagination number",()=>{
    categoriesPage.clickPaginationIndex(1);
});

Then("I should see the corresponding categories for that page", () => {
    categoriesPage.categoryTableRows.should('have.length.greaterThan', 0);
    //verify that the second <td> elements are not empty for each <tr>
    categoriesPage.categoryTableRows.each(($row) => {
        cy.wrap($row).find('td').eq(1).invoke('text').should('not.be.empty');
    });
});

    //page 2
When("I click a different pagination number", () => {
    categoriesPage.clickPaginationIndex(2);

});

Then("I should see a different set of categories", () => {
    categoriesPage.categoryTableRows.should('have.length.greaterThan', 0);
    //verify that the second <td> elements are not empty for each <tr>
    categoriesPage.categoryTableRows.each(($row) => {
        cy.wrap($row).find('td').eq(1).invoke('text').should('not.be.empty');
    });
});

// @Cat_Admin_UI_03 -----------------------------------------------------

Then("I should see and be able to access the Add Category button",()=>{
    categoriesPage.addCategoryButton.should('be.visible');
    categoriesPage.clickAddCategoryButton();
})

// @Cat_Admin_UI_04 -----------------------------------------------------

Then("I should see and be able to access the Edit Category button for each category",()=>{
    //loop through each row of tr of tbody
    categoriesPage.categoryTableRows.each(($row, index) => {
        //for each row, find the edit button in the 4th td
        const editButton = categoriesPage.editButtonByRowIndex(index);
        //verify that the edit button is visible
        editButton.should('be.visible');
    });
});

// @Cat_Admin_UI_05 -----------------------------------------------------

Then("I should see and be able to access the Delete Category button for each category",()=>{
    //loop through each row of tr of tbody
    categoriesPage.categoryTableRows.each(($row, index) => {
        //for each row, find the delete button in the 4th td
        const deleteButton = categoriesPage.deleteButtonByRowIndex(index);
        //verify that the delete button is visible
        deleteButton.should('be.visible');
    });
});

// @Cat_Admin_UI_06 -----------------------------------------------------

let newCategoryName = null;

When("I add a new category using the Add Category button",()=>{
    newCategoryName = "TestCat";
    categoriesPage.clickAddCategoryButton();
    categoriesPage.addCategoryNameInput.type(newCategoryName);
    categoriesPage.addCategorySaveButton.click();
});

Then("the new category should appear in the list",()=>{
    categoriesPage.firstRow.find('td').eq(1).should('have.text', newCategoryName);

    //revert by deleteing the added category
    categoriesPage.clickDeleteButtonByRowIndex(0);
    cy.on('window:confirm', () => true);
});

// @Cat_Admin_UI_07 -----------------------------------------------------

let initialCatName = null;
When("I edit the category using the Edit Category button",()=>{
    //select first category name (2nd td) from category list and store in initialCatName
    categoriesPage.categoryTableRowsByIndex(0).find('td').eq(1).invoke('text').then((text)=>{
        initialCatName = text;
    });

    //click edit button of first category
    categoriesPage.clickEditButtonByRowIndex(0);
 
    categoriesPage.editCategoryNameInput.clear().type("Edited");
    categoriesPage.editCategorySaveButton.click();
});

Then("the category should be updated in the list",()=>{
    categoriesPage.categoryTableRowsByIndex(0).find('td').eq(1).should('have.text', 'Edited');

    //revert by editing back to initial name
    categoriesPage.clickEditButtonByRowIndex(0);
    categoriesPage.editCategoryNameInput.clear().type(initialCatName);
    categoriesPage.editCategorySaveButton.click();
});