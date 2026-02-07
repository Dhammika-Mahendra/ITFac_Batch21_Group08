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

    get noCategoriesMessage(){
        //get a <td> element of class="text-center text-muted py-4" element inside categoryTable
        return this.categoryTable.find('td.text-center.text-muted.py-4');
    }

    verifyNoCategoriesMessage(){
        // message should mention "No category found"
        this.noCategoriesMessage.should('contain.text', 'No category found');
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

    verifyNoAddCategoryButton(){
        //verify in <form> with class="row g-2 mb-3" has no texts "Add Category" in any element
        cy.get('form.row.g-2.mb-3').should('not.contain.text', 'Add Category');
    }

    verifyDeleteButtonDisabled(){
        this.deleteButtonByRowIndex(0).should('be.disabled');
    }

    verifyEditButtonDisabled(){
        this.editButtonByRowIndex(0).should('be.disabled');
    }

    get addCategoryForm(){
        return cy.get('form[action="/ui/categories/add"]');
    }

    get addCategoryNameInput(){
        //input where class="form-control" and name="name" and id=name
        return this.addCategoryForm.find('input.form-control[name="name"][id="name"]');
    }

    get addCategoryParentNameInput(){
        //select where class="form-control" and name="parentId" and id="parentId"
        return this.addCategoryForm.find('select[name="parentId"][id="parentId"]');
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

    invalidNameMessage(msg){
        return cy.get('div.invalid-feedback').contains(msg);
    }
}

export const categoriesPage = new CategoriesPage();