class CategoriesPage {
    get navigationMenu() {
        return cy.get('.sidebar.nav.flex-column');
    }

    get categoriesMenu(){
        return this.navigationMenu.find("a[href='/ui/categories']");
    }

    clickCategoriesMenu(){
        this.categoriesMenu.click();
    }

    get categoryTable(){
        // find the class "table table-striped table-bordered"
        return cy.get("table.table.table-striped.table-bordered");
    }

    get categoryTableRows(){
        return this.categoryTable.find('tbody').find('tr');
    }

    get paginationControls(){   
        //ul element where class having "pagination" word
        return cy.get('ul.pagination');
    }

    clickPaginationIndex(index){
        //select the li>a inside paginationControls where given number is 
        this.paginationControls.find('li').contains('a', index).click();
    }
}

export const categoriesPage = new CategoriesPage();