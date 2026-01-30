@api @sales

Feature: Sales Management
    I want to retrieve and manage sales records

    ************************************************************************ 
    Sales Admin API Scenarios
    ************************************************************************

    @Sale_Admin_API_01
    Scenario: Admin retrieve sales sorted by date
        Given I have logged in as an admin user
        When I call the sales pagination API endpoint with page 0, size 10 and sort soldAt descending
        Then I should receive a 200 status code
        And the response should contain a list of sales
        And the sales should be sorted by soldAt in descending order

    @Sale_Admin_API_02
    Scenario: Admin retrieve sales sorted by plant name
        Given I have logged in as an admin user
        When I call the sales pagination API endpoint with page 0, size 10 and sort PlantName
        Then I should receive a 200 status code
        And the response should contain a list of sales
        And the sales should be sorted by plant name in alphabetical order

    @Sale_Admin_API_03
    Scenario: Admin attempt to retrieve sales with invalid sorting parameter
        Given I have logged in as an admin user
        When I call the sales pagination API endpoint with page 0, size 10 and sort unknownField
        Then I should receive a 500 status code
        And the response should contain an error message about unknown field

    @Sale_Admin_API_04
    Scenario: Admin retrieve sales sorted by quantity
        Given I have logged in as an admin user
        When I call the sales pagination API endpoint with page 0, size 10 and sort quantity
        Then I should receive a 200 status code
        And the response should contain a list of sales
        And the sales should be sorted by quantity in ascending order

    @Sale_Admin_API_05
    Scenario: Admin retrieve sales sorted by total price
        Given I have logged in as an admin user
        When I call the sales pagination API endpoint with page 0, size 10 and sort totalPrice
        Then I should receive a 200 status code
        And the response should contain a list of sales
        And the sales should be sorted by total price in ascending order

    @Sale_Admin_API_06
    Scenario: Admin create sale with invalid plant
        Given I have logged in as an admin user
        When I attempt to create a sale for a non-existent plant
        Then I should receive a 404 status code
        And the response should contain a sale not found error message

    @Sale_Admin_API_07
    Scenario: Admin retrieve single sale by ID
        Given I have logged in as an admin user
        And I have retrieved a list of sales to get an existing sale ID
        When I retrieve a single sale by ID
        Then I should receive a 200 status code
        And the response should contain a single sale with the correct ID

    @Sale_Admin_API_08
    Scenario: Admin delete non-existent sale
        Given I have logged in as an admin user
        When I attempt to delete a non-existent sale
        Then I should receive a 404 delete error response
        And the delete response should contain a sale not found error message

    @Sale_Admin_API_09
    Scenario: Admin create sale with empty plant selection
        Given I have logged in as an admin user
        When I attempt to create a sale without specifying a plant
        Then I should receive a 500 error response
        And the response should contain an error message about missing plant resource

    @Sale_Admin_API_10
    Scenario: Unauthenticated admin cannot create sale
        When I attempt to create a sale without authenticating
        Then I should receive a 401 status code
        And the response should contain an unauthorized error message

    # Sales User API Scenarios

    @Sale_User_API_01
    Scenario: User attempt to retrieve sales with invalid pagination parameters
        Given I have logged in as a testuser
        When I call the sales pagination API endpoint with page 0 and size 0
        Then I should receive a 200 status code
        And the response should contain a list of sales