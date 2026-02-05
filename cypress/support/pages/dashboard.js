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

    getCategoriesCard() {
        this.summaryCardContainer
            .find('.card-body')
            .contains('h6', 'Categories')
            .should('exist')
            .parents('.card-body')
            .find('.fw-bold.fs-5')
    }

    getMainCategoriesCount() {
        // first ".fw-bold.fs-5" class element of getCategoriesCard
        return this.getCategoriesCard()
            .eq(0)
            .invoke('text')
            .then(text => parseInt(text.trim()));
    }

    getSubCategoriesCount() {
        // second ".fw-bold.fs-5" class element of getCategoriesCard
        return this.getCategoriesCard()
            .eq(1)
            .invoke('text')
            .then(text => parseInt(text.trim()));
    }

    getPlantsCard() {
        this.summaryCardContainer
            .find('.card-body')
            .contains('h6', 'Plants')
            .should('exist')
            .parents('.card-body')
            .find('.fw-bold.fs-5')
    }

    getPlantsCount() {
        // first ".fw-bold.fs-5" class element of getPlantsCard
        return this.getPlantsCard()
            .eq(0)
            .invoke('text')
            .then(text => parseInt(text.trim()));
    }

    getLowStockPlantsCount() {
        // second ".fw-bold.fs-5" class element of getPlantsCard
        return this.getPlantsCard() 
            .eq(1)
            .invoke('text')
            .then(text => parseInt(text.trim()));
    }

    getSalesCard() {
        this.summaryCardContainer
            .find('.card-body')
            .contains('h6', 'Sales')
            .should('exist')
            .parents('.card-body')
            .find('.fw-bold.fs-5')
    }

    getTotalSalesCount() {
        // second ".fw-bold.fs-5" class element of getSalesCard
        return this.getSalesCard()
            .eq(1)
            .invoke('text')
            .then(text => parseInt(text.trim()));
    }

    getTotalRevenue() {
        // first ".fw-bold.fs-5" class element of getSalesCard
        return this.getSalesCard()
            .eq(0)
            .invoke('text')
            .then(text => {
                // Remove Rs. at the first and decimal valuse after .
                const numericText = text.replace('Rs.', '').split('.')[0].trim();
                return parseInt(numericText);
            });
    }


}

export const dashboardPage = new DashboardPage();