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