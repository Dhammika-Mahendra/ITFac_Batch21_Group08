class DashboardPage {
    
    get navigationMenu() {
        return cy.get('.sidebar.nav.flex-column');
    }

    verifyActiveDashboardLink() {
        this.navigationMenu
            .find("a[href='/ui/dashboard']")
            .should("have.class", "active");
    }

    get summaryCardContainer() {
        return cy.get('.row.g-4');
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