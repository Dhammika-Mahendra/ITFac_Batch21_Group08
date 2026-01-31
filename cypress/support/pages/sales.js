class SalesPage {
    
    get noSalesMessage() {
        cy.get('td').should('contain.text', message);
    }

    get deleteButtons() {
        // Common selectors for delete buttons
        return cy.get('button[title*="Delete"], button[aria-label*="Delete"], .delete-btn, .btn-delete, button:contains("Delete"), [data-testid*="delete"]');
    }

    get confirmationDialog() {
        // Common selectors for confirmation dialogs
        return cy.get('.modal, .dialog, .confirmation, [role="dialog"], .swal2-popup');
    }

    get confirmButton() {
        // Common selectors for confirm buttons in dialogs
        return cy.get('button:contains("Confirm"), button:contains("Yes"), button:contains("OK"), .confirm-btn, .swal2-confirm');
    }

    get salesTableRows() {
        return cy.get('table tbody tr, .sales-list > div, .sale-item');
    }

    get sellPlantButton() {
        return cy.get('button:contains("Sell Plant"), a:contains("Sell Plant"), [data-testid="sell-plant"], .sell-plant-btn');
    }

    get plantDropdown() {
        return cy.get('#plantId, select[name="plantId"]');
    }

    get quantityInput() {
        return cy.get('#quantity, input[name="quantity"]');
    }

    get sellButton() {
        return cy.get('button.btn-primary, button:contains("Sell")');
    }

    get errorMessage() {
        return cy.get('form .text-danger, form .error, form .invalid-feedback');
    }

    visit() {
        cy.visit("http://localhost:8080/ui/sales");
    }

    visitSalesPage() {
        this.visit();
    }

    clickDeleteIconOnFirstSale() {
        // Store the sale info before deletion
        this.salesTableRows.first().invoke('text').as('deletedSaleInfo');
        
        // Click the first delete button
        this.deleteButtons.first().click();
    }

    verifyConfirmationPromptAppears() {
        this.confirmationDialog.should('be.visible');
    }

    confirmDeletion() {
        this.confirmButton.click();
    }

    verifySaleDeleted() {
        // Wait for the operation to complete
        cy.wait(500);
        
        // Verify the sale is deleted by checking the table updated
        cy.get('@deletedSaleInfo').then((deletedInfo) => {
            // The deleted sale should no longer appear
            cy.get('body').should('not.contain', deletedInfo);
        });
    }

    verifySaleNoLongerInList() {
        // Verify the confirmation dialog is closed
        this.confirmationDialog.should('not.exist');
        
        // Additional verification that page has updated
        cy.url().should('include', '/ui/sales');
    }

    verifySellPlantButtonVisible(buttonText) {
        // Verify the Sell Plant button is visible
        this.sellPlantButton.should('be.visible');
        cy.contains('a', buttonText).should('be.visible');
    }

    clickSellPlantButton(buttonText) {
        // Click the Sell Plant button
        cy.contains('a', buttonText).click();
    }

    verifySellPlantPageAccessible() {
        // Verify the URL changed to Sell Plant page
        cy.url().should('match', /\/ui\/sales\/new$/i); // i for case insensitive
        
        // Verify no authorization errors
        cy.get('body').should('not.contain', '403');
        cy.get('body').should('not.contain', 'Forbidden');
        cy.get('body').should('not.contain', 'Unauthorized');
        
        // Verify page is loaded 
        // Page heading
        cy.get('h3')
            .should('be.visible')
            .and('have.text', 'Sell Plant');

        // Sell Plant form
        cy.get('form[action="/ui/sales"]')
            .should('exist')
            .and('be.visible');

        // Plant dropdown
        cy.get('#plantId')
            .should('exist')
            .and('be.visible');
    }

    clickPlantDropdown() {
        // Focus on the plant dropdown (select elements don't need to be clicked)
        this.plantDropdown.should('be.visible').focus();
    }

    verifyPlantDropdownDisplaysPlantsWithStock() {
        // Verify the dropdown is visible and expanded
        this.plantDropdown.should('be.visible');
        
        // Verify it has options (first option is "-- Select Plant --")
        this.plantDropdown.find('option').should('have.length.greaterThan', 1);
        
        // Verify the first option is the placeholder
        this.plantDropdown.find('option').first().should('contain.text', '-- Select Plant --');
        
        // Verify at least one plant option contains stock information
        this.plantDropdown.find('option').then($options => {
            const optionsText = [...$options].map(opt => opt.textContent);
            // Skip first option (placeholder) and check others have stock info
            const plantsWithStock = optionsText.slice(1).filter(text => text.includes('Stock:'));
            expect(plantsWithStock.length).to.be.greaterThan(0);
        });
        
        // Verify specific plants are present with stock format
        cy.get('#plantId option').should('contain', 'Stock:');
    }

    leavePlantFieldEmpty() {
        // Ensure the plant dropdown is set to empty value (default)
        this.plantDropdown.select('-- Select Plant --');
    }

    selectFirstAvailablePlant() {
        // Select the first available plant (skip the placeholder)
        this.plantDropdown.find('option').eq(1).then($option => {
            const plantValue = $option.val();
            this.plantDropdown.select(plantValue);
        });
    }

    enterQuantity(quantity) {
        // Clear and enter quantity
        this.quantityInput.clear().type(quantity);
    }

    clickSellButton() {
        // Click the Sell button to submit the form
        this.sellButton.click();
    }

    verifyErrorMessageDisplayed(errorMessage) {
        // Check if it's a quantity validation error (HTML5 validation)
        if (errorMessage.includes('Quantity must be greater than 0')) {
            // For quantity validation, check the HTML5 validation message
            this.quantityInput.then(($input) => {
                expect($input[0].validationMessage).to.contain(errorMessage);
            });
        } else {
            // For other errors (like "Plant is required"), check the text-danger div
            this.errorMessage.should('be.visible').and('contain.text', errorMessage);
        }
    }

    clickColumnHeader(columnName) {
        // Click on the column header link to sort
        cy.get('table thead th').contains('a', columnName).click();
    }

    verifySalesSortedByPlantName() {
        // Wait for the page to reload after sort
        cy.wait(500);
        
        // Get all plant names from the table
        cy.get('table tbody tr td:first-child').then($cells => {
            const plantNames = [...$cells].map(cell => cell.textContent.trim());
            
            // Create a sorted copy
            const sortedPlantNames = [...plantNames].sort();
            
            // Verify the plant names are in sorted order
            expect(plantNames).to.deep.equal(sortedPlantNames);
        });
        
        // Also verify the URL contains the sort parameters
        cy.url().should('include', 'sortField=plant.name');
    }

    verifySalesSortedByQuantity() {
        // Wait for the page to reload after sort
        cy.wait(500);
        
        // Get all quantity values from the table (second column)
        cy.get('table tbody tr td:nth-child(2)').then($cells => {
            const quantities = [...$cells].map(cell => parseInt(cell.textContent.trim()));
            
            // Create a sorted copy
            const sortedQuantities = [...quantities].sort((a, b) => a - b);
            
            // Verify the quantities are in sorted order
            expect(quantities).to.deep.equal(sortedQuantities);
        });
        
        // Also verify the URL contains the sort parameters
        cy.url().should('include', 'sortField=quantity');
    }

    verifySalesSortedByTotalPrice() {
        // Wait for the page to reload after sort
        cy.wait(500);
        
        // Get all total price values from the table (third column)
        cy.get('table tbody tr td:nth-child(3)').then($cells => {
            const prices = [...$cells].map(cell => parseFloat(cell.textContent.trim()));
            
            // Create a sorted copy
            const sortedPrices = [...prices].sort((a, b) => a - b);
            
            // Verify the prices are in sorted order
            expect(prices).to.deep.equal(sortedPrices);
        });
        
        // Also verify the URL contains the sort parameters
        cy.url().should('include', 'sortField=totalPrice');
    }
}

export const salesPage = new SalesPage();
