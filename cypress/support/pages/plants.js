class PlantsPage {
    // Page URL
    visitPlantsPage() {
        const baseUrl = Cypress.env("BASE_URL") || "http://localhost:8080";
        cy.visit(`${baseUrl}/ui/plants`);
    }

    // Element selectors
    // Element selectors
    get searchInput() {
        return cy.get('input[name="name"]').first();
    }

    get searchButton() {
        return cy.contains('button', 'Search').first();
    }

    get categoryFilter() {
        return cy.get('select[name="categoryId"]');
    }

    get sortByName() {
        return cy.get('th a[href*="sortField=name"]');
    }

    get sortByPrice() {
        return cy.get('th a[href*="sortField=price"]');
    }

    get sortByQuantity() {
        // HTML shows "Stock" in the header, not "Quantity"
        return cy.get('th a[href*="sortField=quantity"]');
    }

    get addPlantButton() {
        // It's an <a> tag, not a button
        return cy.contains('a.btn', 'Add Plant');
    }

    get plantsTable() {
        return cy.get('table.table');
    }

    get plantRows() {
        // Exclude the "No plants found" row so we don't count it as a result
        return cy.get('table tbody tr').not(':contains("No plants found")');
    }

    get paginationControls() {
        return cy.get('ul.pagination');
    }

    get nextPageButton() {
        return cy.contains('.pagination .page-link', 'Next');
    }

    get previousPageButton() {
        return cy.contains('.pagination .page-link', 'Previous');
    }

    get noDataMessage() {
        // If the table is empty or has a specific message row
        return cy.contains('td', /No plants found|No data/i);
    }

    // Actions
    searchPlant(plantName) {
        this.searchInput.clear().type(plantName);
        this.clickSearch();
        cy.wait(1000); // Wait for search results
        return this;
    }

    clickSearch() {
        this.searchButton.click();
        return this;
    }

    selectCategory(categoryName) {
        // Need to find the option text matching the name
        this.categoryFilter.contains('option', categoryName).then(option => {
            this.categoryFilter.select(option.val());
        });
        return this;
    }

    clickSortByName() {
        this.sortByName.click();
        return this;
    }

    clickSortByPrice() {
        this.sortByPrice.click();
        return this;
    }

    clickSortByQuantity() {
        this.sortByQuantity.click();
        return this;
    }

    clickAddPlant() {
        this.addPlantButton.click();
        return this;
    }

    clickEditPlant(plantName) {
        cy.contains('tr', plantName).within(() => {
            // Edit is an <a> tag with title="Edit"
            cy.get('a[title="Edit"]').click();
        });
        return this;
    }

    clickDeletePlant(plantName) {
        cy.contains('tr', plantName).within(() => {
            // Delete is a <button> with title="Delete" inside a form
            cy.get('button[title="Delete"]').click();
        });
        return this;
    }

    clickNextPage() {
        this.nextPageButton.click();
        return this;
    }

    clickPreviousPage() {
        this.previousPageButton.click();
        return this;
    }

    // Form actions (for Add/Edit pages)
    fillPlantForm({ name, category, price, quantity }) {
        if (name) {
            cy.get('input[name="name"]').clear().type(name);
        }
        if (category) {
            // Assuming the edit form uses specific IDs or names
            cy.get('select[name="categoryId"]').select(category);
        }
        if (price) {
            cy.get('input[name="price"]').clear().type(price);
        }
        if (quantity) {
            cy.get('input[name="quantity"]').clear().type(quantity);
        }
        return this;
    }

    submitPlantForm() {
        cy.get('button.btn-primary').contains('Save').click();
        return this;
    }

    // Verifications
    verifyAddPlantButtonVisible() {
        this.addPlantButton.should('be.visible');
        return this;
    }

    verifyEditButtonsVisible() {
        cy.get('button, a').filter(':contains("Edit"), [title*="Edit"], [aria-label*="Edit"]').should('have.length.at.least', 1);
        return this;
    }

    verifyDeleteButtonsVisible() {
        cy.get('button, a').filter(':contains("Delete"), [title*="Delete"], [aria-label*="Delete"]').should('have.length.at.least', 1);
        return this;
    }

    verifyPlantsListDisplayed() {
        this.plantsTable.should('be.visible');
        return this;
    }

    verifyPaginationVisible() {
        this.paginationControls.should('be.visible');
        return this;
    }

    verifyPlantInList(plantName) {
        cy.contains('tr, .plant-item', plantName).should('be.visible');
        return this;
    }

    verifyPlantNotInList(plantName) {
        cy.contains('tr, .plant-item', plantName).should('not.exist');
        return this;
    }

    verifyNoDataMessage() {
        this.noDataMessage.should('be.visible');
        return this;
    }

    verifyLowBadge(plantName) {
        cy.contains('tr, .plant-item', plantName).within(() => {
            cy.contains(/low/i).should('be.visible');
        });
        return this;
    }

    verifySuccessMessage() {
        cy.get('body').should('contain.text', 'Success').or('contain.text', 'success');
        return this;
    }

    // Get plant data from list
    getPlantCount() {
        return this.plantRows.its('length');
    }

    getPlantNames() {
        const names = [];
        return this.plantRows.each(($row) => {
            names.push($row.find('td').first().text().trim());
        }).then(() => names);
    }

    // Navigate to edit page
    visitEditPlantPage(plantId) {
        const baseUrl = Cypress.env("BASE_URL") || "http://localhost:8080";
        cy.visit(`${baseUrl}/ui/plants/edit/${plantId}`);
        return this;
    }

    // Navigate to add plant page
    visitAddPlantPage() {
        const baseUrl = Cypress.env("BASE_URL") || "http://localhost:8080";
        cy.visit(`${baseUrl}/ui/plants/add`);
        return this;
    }

    verifyFormPreFilled() {
        cy.get('input[name="name"], input#name').should('not.have.value', '');
        cy.get('input[name="price"], input#price').should('not.have.value', '');
        cy.get('input[name="quantity"], input#quantity').should('not.have.value', '');
        // STRICT CHECK: Ensure category is also selected (this is expected to fail due to the UI bug)
        cy.get('select[name="categoryId"]').should('not.have.value', '');
        return this;
    }
}

export const plantsPage = new PlantsPage();
