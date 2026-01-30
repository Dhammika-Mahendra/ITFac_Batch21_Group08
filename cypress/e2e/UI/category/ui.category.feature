@ui @category
Feature: Category Management UI
	As an admin or user, I want to interact with the category management UI

    #----------------------------------------------
    #           Admin User Scenarios
    #----------------------------------------------

	@Cat_Admin_UI_01
	Scenario: Verify Admin view all existing categories
		Given I am logged in as an admin user
		When I click the Categories menu option
		Then I should see a table of list of all categories

	@Cat_Admin_UI_02
	Scenario: Verify Admin view categories list with pagination
		Given I am logged in as an admin user
		When I click the Categories menu option
		Then I should see a table of list of all categories
		And I see a pagination control
		When I click a pagination number
		Then I should see the corresponding categories for that page
		When I click a different pagination number
		Then I should see a different set of categories

	@Cat_Admin_UI_03
	Scenario: Verify Admin can see Add Category button and accessible
		Given I am logged in as an admin user
		When I click the Categories menu option
		Then I should see and be able to access the Add Category button

	@Cat_Admin_UI_04
	Scenario: Verify Admin can see Edit category button and accessible
		Given I am logged in as an admin user
		When I click the Categories menu option
		Then I should see and be able to access the Edit Category button for each category

	@Cat_Admin_UI_05
	Scenario: Verify Admin can see Delete category button and accessible
		Given I am logged in as an admin user
		When I click the Categories menu option
		Then I should see and be able to access the Delete Category button for each category

	@Cat_Admin_UI_06
	Scenario: Verify Admin can Add Category
		Given I am logged in as an admin user
		When I add a new category using the Add Category button
		Then the new category should appear in the list

	@Cat_Admin_UI_07
	Scenario: Verify Admin can Edit category
		Given I am logged in as an admin user and a category exists
		When I edit the category using the Edit Category button
		Then the category should be updated in the list

	@Cat_Admin_UI_08
	Scenario: Verify Admin can Delete category
		Given I am logged in as an admin user and a category exists
		When I delete the category using the Delete Category button
		Then the category should be removed from the list

	@Cat_Admin_UI_09
	Scenario: Verify Admin edit category name within the valid naming constraints
		Given I am logged in as an admin user and a category exists
		When I attempt to edit the category name with invalid data
		Then the system should show a validation error and not update the category

    #----------------------------------------------
    #          Non-Admin User Scenarios 
    #----------------------------------------------

	@Cat_User_UI_01
	Scenario: Verify User view all existing categories
		Given I am logged in as a non-admin user
		When I navigate to the category management page
		Then I should see a list of all categories

	@Cat_User_UI_02
	Scenario: Verify User view categories list with pagination
		Given I am logged in as a non-admin user
		When I view the categories list with pagination controls
		Then I should see categories displayed with pagination

	@Cat_User_UI_03
	Scenario: Verify User cannot access Add Category button
		Given I am logged in as a non-admin user
		When I view the category management page
		Then I should not see the Add Category button

	@Cat_User_UI_04
	Scenario: Verify User cannot Edit category
		Given I am logged in as a non-admin user and a category exists
		When I view the category management page
		Then I should not see the Edit Category button for any category

	@Cat_User_UI_05
	Scenario: Verify User cannot access Delete category button
		Given I am logged in as a non-admin user and a category exists
		When I view the category management page
		Then I should not see the Delete Category button for any category
