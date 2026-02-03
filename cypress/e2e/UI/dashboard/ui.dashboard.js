import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pages/login";
import { dashboardPage } from "../../../support/pages/dashboard";
import { apiLoginAsAdmin, apiLoginAsUser, uiLoginAsAdmin, uiLoginAsUser } from "../../preconditions/login";
import { getAllCategories } from "../../../support/api/category";
import { getAllSales } from "../../../support/api/sales";

Given("I open the login page", () => {
	loginPage.visitLoginPage();
});

When("I sign in with valid admin user credentials", () => {
	uiLoginAsAdmin();
});

When("I sign in with valid non-admin user credentials", () => {
	uiLoginAsUser();
});

Then("I should be redirected to the dashboard", () => {
	cy.url().should("include", "/ui/dashboard");
});

Then("Navigation menu highlights the active pages", () => {
	dashboardPage.verifyActiveDashboardLink();
	dashboardPage.verifyActiveCategoriesLink();
	dashboardPage.verifyActivePlantsLink();
	dashboardPage.verifyActiveSalesLink();
});

//API summmary details

let mainCategoriesCount = 0;
let subCategoriesCount = 0;
let totalPlantsCount = 0;
let lowStockPlantsCount = 0;
let totalSalesCount = 0;
let totalRevenue = 0;

Then("Category, Plants and Sales summary information will be displayed", () => {

	apiLoginAsAdmin();
	
	//store number of categories (where parentName is -) and sub-categories (where parentId is not null)
	getAllCategories().then((response) => {
		const categories = response.body;
		mainCategoriesCount = categories.filter(cat => !cat.parent).length;
		subCategoriesCount = categories.filter(cat => cat.parent).length;}
	);

	// verify main and sub categories count matches with dashboard
	dashboardPage.getMainCategoriesCount().should('eq', mainCategoriesCount);
	dashboardPage.getSubCategoriesCount().should('eq', subCategoriesCount);

	//store number of plants and low stock plants (where quantity <3)
	getAllCategories().then((response) => {
		const categories = response.body;
		totalPlantsCount = categories.reduce((sum, cat) => sum + (cat.plants ? cat.plants.length : 0), 0);
		lowStockPlantsCount = categories.reduce((sum, cat) => 
			sum + (cat.plants ? cat.plants.filter(plant => plant.quantity < 3).length : 0), 0);
	});

	// verify total plants and low stock plants count matches with dashboard
	dashboardPage.getPlantsCount().should('eq', totalPlantsCount);
	dashboardPage.getLowStockPlantsCount().should('eq', lowStockPlantsCount);

	//store total sales count and total revenue (addition of all price properties)
	getAllSales().then((response) => {
		const sales = response.body;
		totalSalesCount = sales.length;
		totalRevenue = sales.reduce((sum, sale) => sum + (sale.price || 0), 0);
	});

	// verify total sales count and total revenue matches with dashboard
	dashboardPage.getSalesCount().should('eq', totalSalesCount);
	dashboardPage.getTotalRevenue().should('eq', totalRevenue);
});