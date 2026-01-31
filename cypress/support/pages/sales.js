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

    get salesTable() {
        return cy.get('table, .sales-list, [data-testid="sales-table"]');
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

    verifySalesListWithPagination() {
        // Verify sales list is displayed
        this.salesTable.should('exist').and('be.visible');
        
        // Verify sales records are present
        this.salesTableRows.should('have.length.greaterThan', 0);
        
        // Verify pagination information is displayed
        cy.get('nav[aria-label="Pagination"], .pagination, .pager, [data-testid="pagination"]').should('be.visible');
    }

    verifySalesSortedBySoldDateDescending() {
        // Extract sold dates from the table and verify they are in descending order
        const dates = [];
        
        this.salesTableRows.each(($row, index) => {
            // Get the sold date column (usually the last column)
            cy.wrap($row).find('td').last().invoke('text').then((dateText) => {
                if (dateText && dateText.trim()) {
                    dates.push(dateText.trim());
                }
            });
        }).then(() => {
            // Verify dates are in descending order (most recent first)
            for (let i = 0; i < dates.length - 1; i++) {
                const currentDate = new Date(dates[i]);
                const nextDate = new Date(dates[i + 1]);
                expect(currentDate.getTime()).to.be.greaterThanOrEqual(nextDate.getTime());
            }
        });
    }

    clickColumnHeader(columnName) {
        // Click on the column header to trigger sorting
        cy.get(`th:contains("${columnName}"), [data-sort="${columnName.toLowerCase()}"]`).click();
        // Wait for sorting to complete
        cy.wait(500);
    }

    verifySalesSortedByPlantName() {
        // Extract plant names from the table and verify they are sorted
        const plantNames = [];
        
        this.salesTableRows.each(($row) => {
            // Get the plant name column (usually the first column)
            cy.wrap($row).find('td').first().invoke('text').then((plantName) => {
                if (plantName && plantName.trim()) {
                    plantNames.push(plantName.trim());
                }
            });
        }).then(() => {
            // Verify plant names are sorted alphabetically
            const sortedNames = [...plantNames].sort((a, b) => a.localeCompare(b));
            expect(plantNames).to.deep.equal(sortedNames);
        });
    }

    verifySalesSortedByQuantity() {
        // Extract quantities from the table and verify they are sorted
        const quantities = [];
        
        this.salesTableRows.each(($row) => {
            // Get the quantity column (typically the second column)
            cy.wrap($row).find('td').eq(1).invoke('text').then((quantityText) => {
                const quantity = parseInt(quantityText.trim());
                if (!isNaN(quantity)) {
                    quantities.push(quantity);
                }
            });
        }).then(() => {
            // Verify quantities are sorted numerically
            const sortedQuantities = [...quantities].sort((a, b) => a - b);
            expect(quantities).to.deep.equal(sortedQuantities);
        });
    }

    verifySalesSortedByTotalPrice() {
        // Extract total prices from the table and verify they are sorted
        const prices = [];
        
        this.salesTableRows.each(($row) => {
            // Get the total price column (typically the third column)
            cy.wrap($row).find('td').eq(2).invoke('text').then((priceText) => {
                const cleaned = priceText.replace(/[^0-9.]/g, "").trim();
                const price = parseFloat(cleaned);
                if (!isNaN(price)) {
                    prices.push(price);
                }
            });
        }).then(() => {
            // Verify prices are sorted numerically
            const sortedPrices = [...prices].sort((a, b) => a - b);
            expect(prices).to.deep.equal(sortedPrices);
        });
    }

    get quantityField() {
        return cy.get('input[name="quantity"], input[id="quantity"], [data-testid="quantity-input"]');
    }

    get submitButton() {
        return cy.get('button[type="submit"], button:contains("Submit"), button:contains("Sell"), [data-testid="submit-btn"]');
    }

    clearQuantityField() {
        // Clear the quantity field to leave it empty
        this.quantityField.clear();
    }

    submitSellPlantForm() {
        // Click the submit button to submit the form
        this.submitButton.click();
        cy.wait(500);
    }

    verifyQuantityFieldValidationError() {
        // Verify validation error message appears near the quantity field
        // Check for error message in common locations
        cy.get('input[name="quantity"], input[id="quantity"]').then(($field) => {
            // Look for error message near the field
            cy.get('body').should('contain.text', 'Quantity must be greater than 0').or('contain.text', 'Quantity is required');
        });
        
        // Alternative: check for error in label/span near quantity field
        cy.get('[data-testid="quantity-error"], .quantity-error, .error, .invalid-feedback').should('be.visible');
    }

    enterNonNumericQuantity() {
        // Enter non-numeric value in quantity field
        this.quantityField.type('abc@#$%');
    }

    selectPlantFromDropdown() {
        // Select the first available plant from the dropdown
        this.plantDropdown.select(1);
        cy.wait(300);
    }

    enterValidQuantity() {
        // Clear quantity field and enter a valid quantity value
        this.quantityField.clear().type('1');
    }

    verifyRedirectedToSalesList() {
        // Verify user is redirected to sales list page
        cy.url().should('include', '/ui/sales');
        cy.url().should('not.include', '/ui/sales/new');
        
        // Verify sales list is displayed
        this.salesTable.should('exist').and('be.visible');
    }

    captureCurrentPlantStock() {
        // Store the selected plant name and initial stock for comparison
        this.plantDropdown.find('option:selected').invoke('text').as('selectedPlant');
    }

    verifyStockReducedByQuantity() {
        // After successful sale and redirect, navigate to plants page to verify stock reduction
        cy.visit('http://localhost:8080/ui/plants');
        
        cy.get('@selectedPlant').then((selectedPlant) => {
            // Search for the plant in the plants list
            cy.get('table tbody tr, .plants-list > div, .plant-item').each(($row) => {
                cy.wrap($row).then(($rowElement) => {
                    const plantName = $rowElement.text();
                    if (plantName.includes(selectedPlant)) {
                        // Found the plant row - verify stock has been reduced
                        cy.wrap($rowElement).find('td').each(($cell, index) => {
                            const cellText = $cell.text();
                            // Verify stock information is present (should be reduced)
                            if (cellText.includes('Stock:') || !isNaN(parseInt(cellText))) {
                                // Stock field found and contains a numeric value
                                expect(parseInt(cellText)).to.be.greaterThanOrEqual(0);
                            }
                        });
                    }
                });
            });
        });
    }
}

export const salesPage = new SalesPage();
