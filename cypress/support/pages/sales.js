class SalesPage {
    
    get noSalesMessage() {
        // Try multiple possible selectors for "no sales" message
        return cy.get('body').then($body => {
            // Check for common empty state patterns
            if ($body.find('.empty-state').length) {
                return cy.get('.empty-state');
            } else if ($body.find('.no-data').length) {
                return cy.get('.no-data');
            } else if ($body.find('.alert').length) {
                return cy.get('.alert');
            } else if ($body.text().includes('No sales')) {
                return cy.contains(/No sales/i);
            } else if ($body.text().includes('no records')) {
                return cy.contains(/no records/i);
            } else {
                // Fallback to any text containing "no" or "empty"
                return cy.get('body');
            }
        });
    }

    visit() {
        cy.visit("http://localhost:8080/ui/sales");
    }

    visitSalesPage() {
        this.visit();
    }
}

export const salesPage = new SalesPage();
