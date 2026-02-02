@api @plants

Feature: Plant Management API
    I want to manage plants after signing in

    #----------------------------------------------
    #           Admin User Scenarios
    #----------------------------------------------

    @Plant_Admin_API_01
    Scenario: Verify that admin can successfully retrieve complete list of all plants with pagination details via API
        Given I have logged in as an admin user
        When I call the plants get API endpoint
        Then I should receive a 200 status code for plants
        And the response should contain a plants array
        And the response should contain pagination details

    @Plant_Admin_API_02
    Scenario: Verify that system returns validation error when admin attempts to create plant with negative price value
        Given I have logged in as an admin user
        When I attempt to create a plant with negative price
        Then I should receive a 400 status code for plant creation
        And the response should contain price validation error message

    @Plant_Admin_API_03
    Scenario: Verify that admin can successfully update category name by providing valid category ID
        Given I have logged in as an admin user
        And a category exists for plant testing
        When I send a request to update the category name
        Then the category update should be successful with 200 status
        And the category name should be updated in response

    @Plant_Admin_API_04
    Scenario: Verify that admin can successfully update existing plant details including name, price and quantity
        Given I have logged in as an admin user
        And a plant exists for testing
        When I send a request to update the plant details
        Then the plant update should be successful with 200 status
        And the plant details should be updated in database

    @Plant_Admin_API_05
    Scenario: Verify that admin can successfully delete an existing plant by providing valid plant ID
        Given I have logged in as an admin user
        And a plant exists for deletion testing
        When I send a DELETE request to remove the plant
        Then the plant deletion should be successful
        And the plant should be removed from database

    @Plant_Admin_API_06
    Scenario: Verify that admin can successfully filter plants by specific category via API
        Given I have logged in as an admin user
        And plants with different categories exist in database
        When I filter plants by first category
        Then I should receive plants only from first category
        When I filter plants by second category
        Then I should receive plants only from second category

    #----------------------------------------------
    #          Regular User Scenarios
    #----------------------------------------------

    @Plant_User_API_01
    Scenario: Verify that regular user can successfully retrieve complete list of all plants via API
        Given I have logged in as a regular user
        When I call the plants get API endpoint
        Then I should receive a 200 status code for plants
        And the response should contain a plants array

    @Plant_User_API_02
    Scenario: Verify that regular user receives access denied error when attempting to create a new plant
        Given I have logged in as a regular user
        When I attempt to create a new plant as regular user
        Then I should receive a 403 Forbidden status code
        And the response should indicate access denied

    @Plant_User_API_03
    Scenario: Verify that regular user receives access denied error when attempting to update existing plant details
        Given I have logged in as a regular user
        And a plant exists in the system
        When I attempt to update plant details as regular user
        Then I should receive a 403 Forbidden status for update
        And the response should indicate insufficient permissions

    @Plant_User_API_04
    Scenario: Verify that regular user receives access denied error when attempting to delete an existing plant
        Given I have logged in as a regular user
        And a plant exists in the system
        When I attempt to delete plant as regular user
        Then I should receive a 403 Forbidden status for deletion
        And the response should indicate access denied for deletion

    @Plant_User_API_05
    Scenario: Verify that regular user can successfully filter plants by specific category via API
        Given I have logged in as a regular user
        And plants with different categories exist in database
        When I filter plants by first category as user
        Then I should receive plants only from first category
        When I filter plants by second category as user
        Then I should receive plants only from second category

    @Plant_User_API_06
    Scenario: Verify that regular user can successfully sort plants by price in both ascending and descending order via API
        Given I have logged in as a regular user
        And multiple plants with different prices exist
        When I sort plants by price in ascending order
        Then plants should be sorted by price low to high
        When I sort plants by price in descending order
        Then plants should be sorted by price high to low

    @Plant_User_API_07
    Scenario: Verify that regular user can successfully sort plants by quantity in descending order via API
        Given I have logged in as a regular user
        And multiple plants with different quantities exist
        When I sort plants by quantity in descending order
        Then plants should be sorted by quantity from highest to lowest
