class DashboardPage {
    
    get navigationMenu() {
        return cy.get('.sidebar.nav.flex-column');
    }

    visit() {
        cy.visit("http://localhost:8080/ui/dashboard");
    }

    visitDashboardPage() {
        this.visit();
    }
}

export const dashboardPage = new DashboardPage();