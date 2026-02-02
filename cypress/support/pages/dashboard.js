class DashboardPage {
    
    get navigationMenu() {
        return cy.get('.sidebar.nav.flex-column');
    }

    verifyActiveDashboardLink() {
        this.navigationMenu
            .find("a[href='/ui/dashboard']")
            .should("have.class", "active");
    }

    verifyActiveCategoriesLink() {
        this.navigationMenu
            .find("a[href='/ui/categories']")
            .should("have.class", "active");
    }

    verifyActivePlantsLink() {
        this.navigationMenu
            .find("a[href='/ui/plants']")
            .should("have.class", "active");
    }

    verifyActiveSalesLink() {
        this.navigationMenu
            .find("a[href='/ui/sales']")
            .should("have.class", "active");
    }

    verifyCategoriesCard() {
        this.summaryCardContainer
            .find('.card-body')
            .contains('h6', 'Categories')
            .should('exist')
            .parents('.card-body')
            .find('.fw-bold.fs-5')
            .invoke('text')
            .should(text => {
                expect(text.trim()).to.match(/^\d+$/);
            });
    }

    verifyPlantsCard() {
        this.summaryCardContainer
            .find('.card-body')
            .contains('h6', 'Plants')
            .should('exist')
            .parents('.card-body')
            .find('.fw-bold.fs-5')
            .invoke('text')
            .should(text => {
                expect(text.trim()).to.match(/^\d+$/);
            });
    }

    verifySalesCard() {
        this.summaryCardContainer
            .find('.card-body')
            .contains('h6', 'Sales')
            .should('exist')
            .parents('.card-body')
            .find('.fw-bold.fs-5')
            .invoke('text')
            .should(text => {
                expect(text.trim()).to.not.equal('');
            });
    }

    //verify above all cards are present and tested 
    verifySummaryCards() {
        this.verifyCategoriesCard();
        this.verifyPlantsCard();
        this.verifySalesCard();
    }
}

export const dashboardPage = new DashboardPage();