class SalesPage {
    
    get noSalesMessage() {
        return cy.contains('No sales found');
    }

    visit() {
        cy.visit("http://localhost:8080/ui/sales");
    }

    visitSalesPage() {
        this.visit();
    }
}

export const salesPage = new SalesPage();
