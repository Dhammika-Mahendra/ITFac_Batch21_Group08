@ui @sales
Feature: Sales Management
    As an admin user
    I want to manage sales records
    So that I can monitor sales activity

    # @Sale_Admin_UI_10
    # Scenario: Verify that "No sales found" message is displayed for admin when no sales exist
    #     Given I am logged in as admin
    #     And no sales exist in the system
    #     When I navigate to the sales page
    #     Then I should see "No sales found" message displayed
    #
    # @Sale_Admin_UI_11
    # Scenario: Verify that admin can delete sale with confirmation
    #     Given I am logged in as admin
    #     And a sale exists in the system
    #     When I navigate to the sales page
    #     And I click the delete icon on a sale
    #     Then a confirmation prompt should appear
    #     When I confirm the deletion
    #     Then the sale should be deleted
    #     And the deleted sale should no longer appear in the sales list

    @Sale_Admin_UI_12
    Scenario: Verify that "Sell Plant" button is visible to Admin
        Given I am logged in as admin
        When I navigate to the sales page
        Then the "Sell Plant" button should be visible

    @Sale_Admin_UI_13
    Scenario: Verify that Sell Plant page is accessible to Admin
        Given I am logged in as admin
        And I navigate to the sales page
        When I click on the "Sell Plant" button
        Then the Sell Plant page should be displayed and accessible
