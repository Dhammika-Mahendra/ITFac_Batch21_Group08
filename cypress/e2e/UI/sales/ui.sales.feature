@ui @sales
Feature: Sales Management
    As an admin or user
    I want to manage sales records
    So that I can monitor sales activity

    #----------------------------------------------
    #           Admin User Scenarios
    #----------------------------------------------
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

    @Sale_Admin_UI_14
    Scenario: Verify that plant dropdown displays available plants with current stock for admin
        Given I am logged in as admin
        And I navigate to the sales page
        And I click on the "Sell Plant" button
        When I click on the plant dropdown
        Then the plant dropdown should display all available plants with their current stock

    @Sale_Admin_UI_15
    Scenario: Verify that plant selection is mandatory when an admin creates a sale
        Given I am logged in as admin
        And I navigate to the sales page
        And I click on the "Sell Plant" button
        When I leave the plant field empty
        And I enter valid quantity "10"
        And I click on the "Sell" button
        Then the error message "Plant is required" should be displayed

    @Sale_Admin_UI_16
    Scenario: Verify that quantity validation for negative values when admin create a sale
        Given I am logged in as admin
        And I navigate to the sales page
        And I click on the "Sell Plant" button
        When I select a plant from the dropdown
        And I enter negative quantity "-5"
        And I click on the "Sell" button
        Then the error message "Quantity must be greater than 0" should be displayed

    @Sale_Admin_UI_17
    Scenario: Verify that quantity validation for 0 when admin create a sale
        Given I am logged in as admin
        And I navigate to the sales page
        And I click on the "Sell Plant" button
        When I select a plant from the dropdown
        And I enter quantity "0"
        And I click on the "Sell" button
        Then the error message "Quantity must be greater than 0" should be displayed

    #----------------------------------------------
    #           Non Admin User Scenarios
    #----------------------------------------------

    @Sale_User_UI_06
    Scenario: Verify that user can sort the sales by Plant Name
        Given I am logged in as user
        And sales exist
        When I navigate to the sales page
        And I click on "Plant" column header to change sort order
        Then the sales records should be sorted correctly by Plant Name

    @Sale_User_UI_07
    Scenario: Verify that user can sort the sales by Quantity
        Given I am logged in as user
        And sales exist
        When I navigate to the sales page
        And I click on "Quantity" column header to change sort order
        Then the sales records should be sorted correctly by Quantity

    @Sale_User_UI_08
    Scenario: Verify that user can sort the sales by Total Price
        Given I am logged in as user
        And sales exist
        When I navigate to the sales page
        And I click on "Total Price" column header to change sort order
        Then the sales records should be sorted correctly by Total Price

    @Sale_User_UI_09
    Scenario: Verify that user can sort the sales by Sold Date
        Given I am logged in as user
        And sales exist
        When I navigate to the sales page
        And I click on "Sold At" column header to change sort order
        Then the sales records should be sorted correctly by Sold Date
