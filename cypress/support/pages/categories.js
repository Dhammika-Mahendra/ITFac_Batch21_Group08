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
        return cy.get("table.table.table-striped.table-bordered");
    }

    get categoryTableRows(){
        return this.categoryTable.find('tbody').find('tr');
    }

    categoryTableRowsByIndex(index){
        return this.categoryTableRows.eq(index);
    }

    get firstRow(){
        return this.categoryTableRowsByIndex(0);
    }

    get paginationControls(){   
        return cy.get('ul.pagination');
    }

    clickPaginationIndex(index){
        this.paginationControls.find('li').contains('a', index).click();
    }

    get addCategoryButton(){
        return cy.get('a.btn.btn-primary').contains('Add A Category');
    }

    clickAddCategoryButton(){
        this.addCategoryButton.click();
    }

    get addCategoryForm(){
        return cy.get('form[action="/ui/categories/add"]');
    }

    get addCategoryNameInput(){
        //input where class="form-control" and name="name" and id=name
        return this.addCategoryForm.find('input.form-control[name="name"][id="name"]');
    }

    get addCategorySaveButton(){
        //button of type=submit
        return this.addCategoryForm.find('button[type="submit"]');
    }

    get editCategoryForm(){
        //form with action has /edit in url
        return cy.get('form[action*="ui/categories/edit"]');
    }

    get editCategoryNameInput(){
        return this.editCategoryForm.find('input.form-control[name="name"][id="name"]');
    }

    get editCategorySaveButton(){
        return this.editCategoryForm.find('button[type="submit"]');
    }

    editButtonByRowIndex(rowIndex){
        return this.categoryTableRowsByIndex(rowIndex).find('td').eq(3).find('a[title="Edit"]');
    }

    clickEditButtonByRowIndex(rowIndex){
        this.editButtonByRowIndex(rowIndex).click();   
    }

    deleteButtonByRowIndex(rowIndex){
        return this.categoryTableRowsByIndex(rowIndex).find('td').eq(3).find('button[title="Delete"]');
    }

    clickDeleteButtonByRowIndex(rowIndex){
        this.deleteButtonByRowIndex(rowIndex).click();
    }
}

export const categoriesPage = new CategoriesPage();