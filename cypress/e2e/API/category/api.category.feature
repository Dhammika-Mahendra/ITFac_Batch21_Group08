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
        Given category list exists
        When I request categories with pagination parameters
        Then I should receive a paginated list of categories
        When I request categories with pagination different parameters
        Then I should receive a different paginated list of categories

    @Cat_Admin_API_03
    Scenario: Verify Admin is able to create a new main category
        Given I have logged in as an admin user
        When I send a request to create a new main category
        Then the category should be created successfully

    @Cat_Admin_API_04
    Scenario: Verify Admin can edit an existing category name
        Given I have logged in as an admin user
        Given a category exists
        When I send a request to edit the category name
        Then the category name should be updated successfully

    @Cat_Admin_API_05
    Scenario: Verify Admin edit category name happens within the valid naming constraints
        Given I have logged in as an admin user
        Given a category exists
        When I attempt to edit the category name with invalid data - empty name
        Then the system should reject the name update with a validation error
        When I attempt to edit the category name with invalid data - short name
        Then the system should reject the name update with a validation error
        When When I attempt to edit the category name with invalid data - long name
        Then the system should reject the name update with a validation error

    @Cat_Admin_API_06
    Scenario: Verify Admin can delete an existing category
        Given I have logged in as an admin user
        Given a category exists
        When I send a request to delete the category
        Then the category should be deleted successfully

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