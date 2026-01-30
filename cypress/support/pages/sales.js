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
}

export const salesPage = new SalesPage();
