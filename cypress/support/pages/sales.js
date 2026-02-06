class SalesPage {
    
    verifyNoSalesMessage(message) {
        // Check for the "No sales found" message in the table or on the page
        cy.get('body').should('contain.text', message);
    }

    get deleteButtons() {
        // Selector for delete buttons in sales table
        return cy.get('form[action*="/ui/sales/delete/"] button.btn-outline-danger');
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
        cy.visit(Cypress.env("BASE_URL") + "/ui/sales");
    }

    visitSalesPage() {
        this.visit();
        // Verify page content loads
        this.salesTable.should('exist');
    }

    visitPlantPage(){
        cy.visit(Cypress.env("BASE_URL") + "/ui/plants");
    }

    captureFirstSaleDetails() {
        // Capture plant name (first column) and quantity (second column) from the first sale
        this.salesTableRows.first().find('td').eq(0).invoke('text').then((plantName) => {
            const trimmedPlantName = plantName.trim();
            cy.wrap(trimmedPlantName).as('deletedSalePlantName'); // Set alias for the plant name
            cy.log(`Alias set for deletedSalePlantName: ${trimmedPlantName}`); // Debug log
        });

        this.salesTableRows.first().find('td').eq(1).invoke('text').then((quantity) => {
            const trimmedQuantity = quantity.trim();
            cy.wrap(trimmedQuantity).as('deletedSaleQuantity'); // Set alias for the quantity
            cy.log(`Alias set for deletedSaleQuantity: ${trimmedQuantity}`); // Debug log
        });
        
        // Also capture the entire row text for deletion verification
        this.salesTableRows.first().find('td').eq(0).invoke('text').then(plantName => {
            this.salesTableRows.first().find('td').eq(3).invoke('text').then(soldAt => {
                cy.wrap(`${plantName.trim()}${soldAt.trim()}`).as('deletedSaleIdentifier');
            });
        });
    }

    clickDeleteIconOnFirstSale() {
        // Set up stub for the native browser confirm dialog
        cy.window().then((win) => {
            cy.stub(win, 'confirm').returns(true).as('confirmStub');
        });
        
        // Click the first delete button
        this.deleteButtons.first().click();
    }

    verifyConfirmationPromptAppears() {
        // Verify that the native confirm dialog was called
        cy.get('@confirmStub').should('have.been.calledOnce');
        cy.get('@confirmStub').should('have.been.calledWith', 'Are you sure you want to delete this sale?');
    }

    confirmDeletion() {
        // Native confirm is already stubbed to return true, so no action needed
        // Just wait for the deletion to complete
        cy.wait(500);
    }

    verifySaleDeleted() {
        // Wait for the page to reload after deletion
        cy.wait(1000);
        
        // Verify the sale is deleted by checking the specific identifier no longer appears
        cy.get('@deletedSaleIdentifier').then((identifier) => {
            // Check that this specific combination of plant name and sold date doesn't exist
            cy.get('table tbody tr').should('not.contain', identifier);
        });
    }

    verifySaleNoLongerInList() {
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

    clickAdminColumnHeader(columnName) {
        // Click on the column header to trigger sorting
        // Use case-insensitive matching for column headers
        cy.get('table thead th').contains(new RegExp(columnName, 'i')).click();
        // Wait for sorting to complete
        cy.wait(500);
    }

    verifyAdminSalesSortedByPlantName() {
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

    verifyAdminSalesSortedByQuantity() {
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
            // Look for error message near the field - check for either message
            cy.get('body').should(($body) => {
                const text = $body.text();
                expect(text).to.match(/Quantity must be greater than 0|Quantity is required/);
            });
        });
        
        // Alternative: check for error in label/span near quantity field
        cy.get('[data-testid="quantity-error"], .quantity-error, .error, .invalid-feedback').should('be.visible');
    }

    enterNonNumericQuantity() {
        // Enter non-numeric value in quantity field
        this.quantityField.type('abc@#$%');
    }

    selectPlantFromDropdown() {
        // Get the captured plant name and select it from the dropdown
        cy.then(() => {
            // Try to get the selectedPlant alias
            const aliases = Cypress.state('aliases') || {};
            if (aliases.selectedPlant) {
                cy.get('@selectedPlant').then((plantName) => {
                    // Find the option that contains the plant name and select it
                    this.plantDropdown.find('option').each(($option, index) => {
                        if ($option.text().includes(plantName)) {
                            this.plantDropdown.select($option.val());
                            return false; // Break the loop
                        }
                    });
                });
            } else {
                // No selectedPlant alias exists, select the first available plant
                this.plantDropdown.select(1);
            }
        });
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
        // Check the current URL to determine which test scenario we're in
        cy.url().then((url) => {
            if (url.includes('/ui/plants')) {
                // We're on the plants page - for delete sale test (Sale_Admin_UI_11)
                // Use the deleted sale plant name alias
                cy.get('@deletedSalePlantName').then((plantName) => {
                    cy.get('table tbody tr')
                        .contains('td', plantName)
                        .parent('tr')
                        .find('td').eq(3)
                        .find('span').first()
                        .invoke('text')
                        .then((stockText) => {
                            const stockBeforeDeletion = parseInt(stockText.trim());

                            expect(
                                stockBeforeDeletion,
                                `Stock before deletion should exist for plant ${plantName}`,
                            ).to.not.be.NaN;

                            cy.wrap(stockBeforeDeletion).as('stockBeforeDeletion');
                            cy.log(`Stock before deletion for ${plantName}: ${stockBeforeDeletion}`);
                        });
                });
            } else {
                // We're on the sales page - for sell plant test (Sale_Admin_UI_09)
                // Navigate to plants page and capture the first plant's stock
                cy.visit(Cypress.env("BASE_URL") + "/ui/plants");
                cy.get('table tbody tr').first().then(($row) => {
                    const plantName = $row.find('td').eq(0).text().trim();
                    const stockText = $row.find('td').eq(3).find('span').first().text().trim();
                    const stock = parseInt(stockText);
                    
                    expect(stock, `Stock should exist for plant ${plantName}`).to.not.be.NaN;
                    
                    cy.wrap(plantName).as('selectedPlant');
                    cy.wrap(stock).as('initialStock');
                    cy.log(`Captured stock for ${plantName}: ${stock}`);
                    
                    // Navigate back to the sales page
                    cy.visit(Cypress.env("BASE_URL") + "/ui/sales");
                });
            }
        });
    }

    verifyStockReducedByQuantity() {
        // After successful sale and redirect, navigate to plants page to verify stock reduction
        cy.visit(Cypress.env("BASE_URL") + "/ui/plants");
        
        cy.get('@selectedPlant').then((selectedPlant) => {
            cy.get('@initialStock').then((initialStock) => {
                // Find the plant row and get the current stock
                cy.get('table tbody tr').each(($row) => {
                    const plantName = $row.find('td').eq(0).text().trim();
                    if (plantName === selectedPlant) {
                        const currentStockText = $row.find('td').eq(3).find('span').first().text().trim();
                        const currentStock = parseInt(currentStockText);
                        
                        // Verify stock was reduced by 1 (the quantity we entered)
                        expect(currentStock, `Stock for ${selectedPlant} should be reduced`).to.equal(initialStock - 1);
                        cy.log(`Stock reduced from ${initialStock} to ${currentStock} for ${selectedPlant}`);
                        return false; // Break the loop
                    }
                });
            });
        });
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
        // Updated to use case-insensitive matching for column headers
        cy.get('table thead th').contains(new RegExp(columnName, 'i')).click();
    }

    verifySalesSortedByPlant() {
        const plantNames = [];
        cy.get('table tbody tr').each(($row) => {
            cy.wrap($row).find('td').eq(0).invoke('text').then((text) => {
                plantNames.push(text.trim());
            });
        }).then(() => {
            const sorted = [...plantNames].sort();
            expect(plantNames).to.deep.equal(sorted);
        });
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

    verifySalesSortedBySoldDate() {
        // Wait for the page to reload after sort
        cy.wait(500);
        
        // Get all sold date values from the table (fourth column)
        cy.get('table tbody tr td:nth-child(4)').then($cells => {
            const dates = [...$cells].map(cell => new Date(cell.textContent.trim()));
            
            // Create a sorted copy
            const sortedDates = [...dates].sort((a, b) => a - b);
            
            // Verify the dates are in sorted order
            expect(dates.map(d => d.getTime())).to.deep.equal(sortedDates.map(d => d.getTime()));
        });
        
        // Also verify the URL contains the sort parameters
        cy.url().should('include', 'sortField=soldAt');
    }

   verifySellPlantButtonNotVisible(buttonText) {
        // Verify the "Sell Plant" button is not visible to regular user
        // The button should either not exist or not be visible
        cy.get('body').then(($body) => {
            if ($body.find(`button:contains("${buttonText}"), a:contains("${buttonText}"), [data-testid="sell-plant"]`).length > 0) {
                // Button exists, verify it's not visible
                cy.get(`button:contains("${buttonText}"), a:contains("${buttonText}"), [data-testid="sell-plant"]`).should('not.be.visible');
            } else {
                // Button doesn't exist at all - user doesn't have access
                cy.get(`button:contains("${buttonText}"), a:contains("${buttonText}"), [data-testid="sell-plant"]`).should('not.exist');
            }
        });
    }

    verifyButtonNotVisibleOnPage(buttonText) {
        // Verify the button is not visible on the page
        cy.get('body').then(($body) => {
            const buttonSelector = `button:contains("${buttonText}"), a:contains("${buttonText}"), [data-testid="sell-plant"], .sell-plant-btn`;
            if ($body.find(buttonSelector).length > 0) {
                // Button exists, verify it's not visible
                cy.get(buttonSelector).should('not.be.visible');
            } else {
                // Button doesn't exist at all
                cy.get(buttonSelector).should('not.exist');
            }
        });
    }

    checkForDeleteActions() {
        // Check if there are any delete buttons visible for the user
        cy.get('body').then(($body) => {
            // Store whether delete buttons exist
            const deleteButtonExists = $body.find('button[title*="Delete"], button[aria-label*="Delete"], .delete-btn, .btn-delete, button:contains("Delete"), [data-testid*="delete"]').length > 0;
            cy.wrap(deleteButtonExists).as('deleteButtonExists');
        });
    }

    verifyDeleteButtonNotAvailableToUser() {
        // Verify delete actions are not available to user
        cy.get('body').then(($body) => {
            const deleteSelectors = [
                'button[title*="Delete"]',
                'button[aria-label*="Delete"]',
                '.delete-btn',
                '.btn-delete',
                'button:contains("Delete")',
                '[data-testid*="delete"]'
            ];

            // Check each selector
            deleteSelectors.forEach((selector) => {
                if ($body.find(selector).length > 0) {
                    // Delete button exists, verify it's not visible
                    cy.get(selector).each(($element) => {
                        cy.wrap($element).should('not.be.visible');
                    });
                }
            });
        });

        // Also verify by checking the table rows don't have delete action columns
        this.salesTableRows.each(($row) => {
            cy.wrap($row).then(($rowElement) => {
                const rowText = $rowElement.text();
                // Verify no delete icon/button is present in the row
                if ($rowElement.find('button[title*="Delete"], button[aria-label*="Delete"]').length > 0) {
                    cy.wrap($rowElement).find('button[title*="Delete"], button[aria-label*="Delete"]').should('not.be.visible');
                }
            });
        });
    }
    
    verifyPlantStockIncreased() {
        // Wait for plants page to load
        cy.wait(500);
        
        // Get the stored values
        cy.get('@deletedSalePlantName').then(plantName => {
            cy.get('@deletedSaleQuantity').then(deletedQuantity => {
                cy.get('@stockBeforeDeletion').then(stockBefore => {
                    cy.log(`Verifying stock for plant: ${plantName}`);
                    
                    // Find the plant in the table
                    cy.get('table tbody tr').then($rows => {
                        let stockVerified = false;
                        $rows.each((index, row) => {
                            if (stockVerified) return;
                            
                            const $row = Cypress.$(row);
                            const rowPlantName = $row.find('td').eq(0).text().trim();
                            
                            if (rowPlantName === plantName) {
                                // Found the plant, verify its stock
                                const stockText = $row.find('td').eq(3).find('span').text().trim();
                                const stockAfter = parseInt(stockText);
                                
                                // Calculate expected stock after deletion
                                const expectedStock = stockBefore + deletedQuantity;
                                
                                // Verify stock increased by the deleted quantity
                                expect(stockAfter).to.equal(expectedStock);
                                
                                // Log for verification
                                cy.log(`Plant: ${plantName}`);
                                cy.log(`Stock Before: ${stockBefore}`);
                                cy.log(`Deleted Quantity: ${deletedQuantity}`);
                                cy.log(`Stock After: ${stockAfter}`);
                                cy.log(`Expected Stock: ${expectedStock}`);
                                
                                stockVerified = true;
                            }
                        });
                    });
                });
            });
        });
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
}

export const salesPage = new SalesPage();
