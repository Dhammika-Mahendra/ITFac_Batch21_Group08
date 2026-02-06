@ui @sales
Feature: Sales UI
    
    As an admin user
    I want to manage sales records
    So that I can monitor sales activity

    #----------------------------------------------
    #           Admin User Scenarios
    #----------------------------------------------

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
        And I click on the "Sold At" column header
        Then the sales should be displayed in descending order by sold date

    @Sale_Admin_UI_03
    Scenario: Verify that Admin can sort the sales by Plant Name
        Given I am logged in as admin
        And sales exist in the system
        When I navigate to the sales page
        And I click on the "Plant" column header
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
        Then the error message "Quantity must be greater than 0" should be displayed

    @Sale_Admin_UI_07
    Scenario: Verify that Quantity field does not accept non-numeric values
        Given I am logged in as admin
        And I am on the Sales page
        And I click on the "Sell Plant" button
        When I try to enter a non-numeric value in the Quantity field
        Then the Quantity field should not accept the non-numeric value

    @Sale_Admin_UI_08
    Scenario: Verify that after a successful plant selling, admin redirects to sales list automatically
        Given I am logged in as admin
        And I navigate to the sales page
        And I click on the "Sell Plant" button
        When I select a plant from the dropdown
        And I enter a valid quantity
        And I submit the form
        Then admin should be redirected to the sales list page

    @Sale_Admin_UI_09
    Scenario: Verify that successful plant sale reduces stock
        Given I am logged in as admin
        And I navigate to the sales page
        When I capture the current plant stock
        And I click on the "Sell Plant" button
        And I select a plant from the dropdown
        And I enter a valid quantity
        And I submit the form
        And I redirected to the sales list page
        Then the plant stock should be reduced by the sold quantity

    #*******************************************214160H****************************************************
    @Sale_Admin_UI_10
    Scenario: Verify that "No sales found" message is displayed for admin when no sales exist
        Given I am logged in as admin
        And no sales exist in the system
        When I navigate to the sales page
        Then I should see "No sales found" message displayed
    
    @Sale_Admin_UI_11
    Scenario: Verify that admin can delete sale with confirmation
        Given I am logged in as admin
        When I navigate to the sales page
        And I capture the plant name and quantity from the first sale
        And I navigate to the plants page
        And I capture the current plant stock
        When I navigate to the sales page
        And I click the delete icon on a sale
        Then a confirmation prompt should appear
        When I confirm the deletion
        Then the sale should be deleted
        And the deleted sale should no longer appear in the sales list
        When I navigate to the plants page
        Then the plant stock should be increased by the deleted sale quantity

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
        When I select first available plant from the dropdown
        And I enter negative quantity "-5"
        And I click on the "Sell" button
        Then the error message "Quantity must be greater than 0" should be displayed

    @Sale_Admin_UI_17
    Scenario: Verify that quantity validation for 0 when admin create a sale
        Given I am logged in as admin
        And I navigate to the sales page
        And I click on the "Sell Plant" button
        When I select first available plant from the dropdown
        And I enter quantity "0"
        And I click on the "Sell" button
        Then the error message "Quantity must be greater than 0" should be displayed

    #****************************************************************************************************

    #----------------------------------------------
    #           Non Admin User Scenarios
    #----------------------------------------------

    @Sale_User_UI_01
    Scenario: Verify that user cannot access Sales page
        Given I am logged in as testuser
        When I navigate to the Sales page
        Then I should be denied access to the sales page
        Then the error message "Access Denied" should be displayed


    @Sale_User_UI_02
    Scenario: Verify that "Sell Plant" button is not visible to User
        Given I am logged in as testuser
        When I navigate to the Sales page
        Then the "Sell Plant" button should not be visible on the page

    @Sale_User_UI_03
    Scenario: Verify that testuser cannot delete a row from Sales page
        Given I am logged in as testuser
        And I navigate to the Sales page
        When I check for delete actions on sales records
        Then delete button should not be visible or available to user

    @Sale_User_UI_04
    Scenario: Verify that user can view sales list with pagination information
        Given I am logged in as testuser
        And sales exist in the system
        When I navigate to the Sales page
        Then the sales list should be displayed with pagination information

    @Sale_User_UI_05
    Scenario: Verify that user can view sales are displayed in descending order by sold date
        Given I am logged in as testuser
        And sales exist in the system
        When I navigate to the Sales page
        Then the sales should be displayed in descending order by sold date

    #*******************************************214160H****************************************************
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

    @Sale_User_UI_10
    Scenario: Verify that "No sales found" message is displayed for user when no sales exist
        Given I am logged in as user
        And no sales exist in the system
        When I navigate to the sales page
        Then I should see "No sales found" message displayed
