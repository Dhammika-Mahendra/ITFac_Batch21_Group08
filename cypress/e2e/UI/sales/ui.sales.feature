@ui @sales
Feature: Sales Management
    As an admin user
    I want to manage sales records
    So that I can monitor sales activity

    @Sale_Admin_UI_10
    Scenario: Verify that "No sales found" message is displayed for admin when no sales exist
        Given I am logged in as admin
        And no sales exist in the system
        When I navigate to the sales page
        Then I should see "No sales found" message displayed
