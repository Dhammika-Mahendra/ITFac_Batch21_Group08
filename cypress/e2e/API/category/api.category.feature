@api @category

Feature: Category Management
    I want to manage categories after signing in

    #----------------------------------------------
    #           Admin User Scenarios
    #----------------------------------------------

    @Cat_Admin_API_01
    Scenario: Verify Admin can retrieve all existing categories
        Given I have logged in as an admin user
        When I call the categories get API point
        Then I should receive a 200 status code
        And the response should contain a list of categories

    @Cat_Admin_API_02
    Scenario: Verify Admin can get existing categories with pagination
        Given I have logged in as an admin user
        When I request categories with pagination parameters
        Then I should receive a paginated list of categories

    @Cat_Admin_API_03
    Scenario: Verify Admin is able to create a new category
        Given I have logged in as an admin user
        When I send a request to create a new category
        Then the category should be created successfully

    @Cat_Admin_API_04
    Scenario: Verify Admin can edit an existing category name
        Given I have logged in as an admin user and a category exists
        When I send a request to edit the category name
        Then the category name should be updated successfully

    @Cat_Admin_API_05
    Scenario: Verify Admin edit category name happens within the valid naming constraints
        Given I have logged in as an admin user and a category exists
        When I attempt to edit the category name with invalid data
        Then the system should reject the update with a validation error

    @Cat_Admin_API_06
    Scenario: Verify Admin can delete an existing category
        Given I have logged in as an admin user and a category exists
        When I send a request to delete the category
        Then the category should be deleted successfully

    @Cat_Admin_API_07
    Scenario: Verify that an Admin can successfully delete an existing category using a valid Category ID
        Given I have logged in as an admin user and a category exists
        When I send a DELETE request to the category endpoint with a valid category ID
        Then I should receive a 204 status code for deletion
        And the category should be deleted successfully

    @Cat_Admin_API_08
    Scenario: Verify that the system handles errors when an Admin attempts to delete a category with an invalid Category ID
        Given I have logged in as an admin user
        When I send a DELETE request to the category endpoint with an invalid category ID
        Then I should receive a 404 status code for deletion
        And the response should contain an error message about category not found

    @Cat_Admin_API_09
    Scenario: Verify that an admin can successfully create a main category by submitting a category with an empty Parent Category
        Given I have logged in as an admin user
        When I send a POST request to create a main category with empty parent
        Then I should receive a 201 status code for creation
        And the response should contain the created main category details

    @Cat_Admin_API_10
    Scenario: Verify that a restricted admin is denied access when attempting to create a category with a valid parent ID
        Given I have logged in as an admin user
        When I send a POST request to create a sub-category with a valid parent ID
        Then I should receive a 201 status code for sub-category creation
        And the response should contain the created sub-category details

    @Cat_Admin_API_11
    Scenario: Verify that a restricted admin is denied access when attempting to create a category with an invalid parent ID
        Given I have logged in as an admin user
        When I send a POST request to create a sub-category with an invalid parent ID
        Then I should receive a 500 status code for invalid parent
        And the response should contain an error message about foreign key constraint

    #----------------------------------------------
    #          Non-Admin User Scenarios 
    #----------------------------------------------

    @Cat_User_API_01
    Scenario: Verify User can retrieve all exiting categories
        Given I have logged in as a non-admin user
        When I call the categories get API point
        Then I should receive a 200 status code
        And the response should contain a list of categories

    @Cat_User_API_02
    Scenario: Verify User can get existing categories with pagination
        Given I have logged in as a non-admin user
        When I request categories with pagination parameters
        Then I should receive a paginated list of categories

    @Cat_User_API_03
    Scenario: Verify User attempt to create new category
        Given I have logged in as a non-admin user
        When I attempt to create a new category
        Then the system should reject the request with an authorization error

    @Cat_User_API_04
    Scenario: Verify User attempt to edit an existing category
        Given I have logged in as a non-admin user and a category exists
        When I attempt to edit the category name
        Then the system should reject the request with an authorization error

    @Cat_User_API_05
    Scenario: Verify User attempt to delete an existing category
        Given I have logged in as a non-admin user and a category exists
        When I attempt to delete the category
        Then the system should reject the request with an authorization error