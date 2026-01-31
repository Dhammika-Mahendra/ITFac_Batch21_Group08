@ui @sales
Feature: Sales Management

    #************************************************************************
    # Sales Admin UI Scenarios
    #************************************************************************
    
    As an admin user
    I want to manage sales records
    So that I can monitor sales activity

    @Sale_Admin_UI_01
    Scenario: Verify admin can view sales list with pagination information
        Given I am logged in as admin
        And sales exist in the system
        When I navigate to the sales page
        Then the sales list should be displayed with pagination information

    @Sale_Admin_UI_02
    Scenario: Verify that admin can view sales by descending order of sold date
        Given I am logged in as admin
        And sales exist in the system
        When I navigate to the sales page
        And I click on the "Sold date" column header
        Then the sales should be displayed in descending order by sold date

    @Sale_Admin_UI_03
    Scenario: Verify that Admin can sort the sales by Plant Name
        Given I am logged in as admin
        And sales exist in the system
        When I navigate to the sales page
        And I click on the "Plant name" column header
        Then the sales should be sorted by Plant Name

    @Sale_Admin_UI_04
    Scenario: Verify that Admin can sort the sales by Quantity
        Given I am logged in as admin
        And sales exist in the system
        When I navigate to the sales page
        And I click on the "Quantity" column header
        Then the sales should be sorted by Quantity

    @Sale_Admin_UI_05
    Scenario: Verify that Admin can sort the sales by Total price
        Given I am logged in as admin
        And sales exist in the system
        When I navigate to the sales page
        And I click on the "Total price" column header
        Then the sales should be sorted by Total price

    @Sale_Admin_UI_06
    Scenario: Verify validation for empty quantity
        Given I am logged in as admin
        And I am on the Sales page
        And I click on the "Sell Plant" button
        When I leave the Quantity field empty
        And I submit the form
        Then an error message should appear for Quantity field

    @Sale_Admin_UI_07
    Scenario: Verify validation for non numeric quantity
        Given I am logged in as admin
        And I am on the Sales page
        And I click on the "Sell Plant" button
        When I enter a non-numeric value in the Quantity field
        And I submit the form
        Then an error message should appear for Quantity field

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
