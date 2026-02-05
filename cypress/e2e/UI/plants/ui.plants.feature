@ui @plants

Feature: Plants UI
    I want to manage plants through the user interface

    #----------------------------------------------
    #           Admin User Scenarios
    #----------------------------------------------

    @Plant_Admin_UI_01
    Scenario: Verify that admin can successfully view paginated plants list with admin-specific controls (Add or Delete) on UI
        Given I have logged in to the UI as an admin user
        When I navigate to the plants page
        Then the plants list should be displayed with pagination
        And pagination buttons should be visible
        And Edit and Delete actions should be visible for plants

    @Plant_Admin_UI_02
    Scenario: Verify that admin can successfully search for plants by entering partial or full plant name in search field
        Given I have logged in to the UI as an admin user
        And I am on the plants page
        When I enter partial plant name in search field
        And I click the search button
        Then only matching plants should be displayed

    @Plant_Admin_UI_03
    Scenario: Verify that 'Add Plant' button is visible and accessible only to admin users on plants list page
        Given I have logged in to the UI as an admin user
        When I navigate to the plants page
        Then the Add Plant button should be visible
        And the Add Plant button should be clickable

    @Plant_Admin_UI_04
    Scenario: Verify that Edit and Delete action buttons are visible and accessible only to admin users for each plant
        Given I have logged in to the UI as an admin user
        And I am on the plants page
        Then Edit icons should be visible for all plants
        And Delete icons should be visible for all plants

    @Plant_Admin_UI_05
    Scenario: Verify that admin can successfully edit plant name by clicking Edit button and saving changes
        Given I have logged in to the UI as an admin user
        And I am on the plants page
        When I click Edit button for a plant
        And I modify the plant name
        And I click Save button
        Then the changes should be saved successfully
        And the updated plant name should be displayed in the list

    @Plant_Admin_UI_06
    Scenario: Verify that admin can successfully edit plant quantity by clicking Edit button and saving changes
        Given I have logged in to the UI as an admin user
        And I am on the plants page
        When I click Edit button for a plant
        And I modify the plant quantity
        And I click Save button
        Then the quantity changes should be saved successfully
        And the updated plant quantity should be displayed in the list

    @Plant_Admin_UI_07
    Scenario: Verify that admin can successfully access Edit Plant page with pre-filled form data for existing plant
        Given I have logged in to the UI as an admin user
        And a plant with valid ID exists
        When I navigate to the Edit Plant page for that plant
        Then the Edit Plant form should be displayed
        And all form fields should be pre-filled with existing plant data

    @Plant_Admin_UI_08
    Scenario: Verify that the system displays a validation error when the Plant Name field is empty
        Given I have logged in to the UI as an admin user
        When I navigate to the Add Plant page
        And I leave the Plant Name field empty
        And I fill in other required fields correctly
        And I click Save button
        Then a validation error message should be displayed
        And the error message should say "Plant name is required"

    @Plant_Admin_UI_09 
    Scenario: Verify that the system displays a validation error when the Plant Name is less than 3 characters
        Given I have logged in to the UI as an admin user
        When I navigate to the Add Plant page
        And I enter a Plant Name with less than 3 characters
        And I fill in other required fields correctly
        And I click Save button
        Then a validation error message should be displayed
        And the error message should say "Plant name must be between 3 and 25 characters"

    @Plant_Admin_UI_10 
    Scenario: Verify that the system displays a validation error when the Plant Name exceeds 25 characters
        Given I have logged in to the UI as an admin user
        When I navigate to the Add Plant page
        And I enter a Plant Name with more than 25 characters
        And I fill in other required fields correctly
        And I click Save button
        Then a validation error message should be displayed
        And the error message should say "Plant name must be between 3 and 25 characters"

    @Plant_Admin_UI_11 
    Scenario: Verify that the system displays a validation error when the Price field is empty
        Given I have logged in to the UI as an admin user
        When I navigate to the Add Plant page
        And I fill valid Name, Category and Quantity
        And I leave the Price field empty
        And I click Save button
        Then a validation error message should be displayed
        And the error message should say "Price is required"

    @Plant_Admin_UI_12 
    Scenario: Verify that the system displays a validation error when the Price is a negative value
        Given I have logged in to the UI as an admin user
        When I navigate to the Add Plant page
        And I fill valid Name, Category and Quantity
        And I enter Price as a negative value
        And I click Save button
        Then a validation error message should be displayed
        And the error message should say "Price must be greater than 0"

    @Plant_Admin_UI_13 
    Scenario: Verify that the system displays a validation error when the Quantity field is empty
        Given I have logged in to the UI as an admin user
        When I navigate to the Add Plant page
        And I fill valid Name, Category and Price
        And I leave the Quantity field empty
        And I click Save button
        Then a validation error message should be displayed
        And the error message should say "Quantity is required"

    @Plant_Admin_UI_14 
    Scenario: Verify that the system displays a validation error when the Quantity is a negative value
        Given I have logged in to the UI as an admin user
        When I navigate to the Add Plant page
        And I fill valid Name, Category and Price
        And I enter Quantity as a negative value
        And I click Save button
        Then a validation error message should be displayed
        And the error message should say "Quantity cannot be negative"

    @Plant_Admin_UI_15
    Scenario: Verify that the system accepts a Quantity value of 0
        Given I have logged in to the UI as an admin user
        When I navigate to the Add Plant page
        And I fill valid Name, Category and Price
        And I enter Quantity as 0
        And I click Save button
        Then the plant should be saved successfully with quantity = 0

    @Plant_Admin_UI_16
    Scenario: Verify that the system displays a validation error when the Category is not selected
        Given I have logged in to the UI as an admin user
        When I navigate to the Add Plant page
        And I fill valid Name, Price and Quantity
        And I leave the Category field unselected
        And I click Save button
        Then a validation error message should be displayed
        And the error message should say "Category is required"

    #----------------------------------------------
    #          Regular User Scenarios
    #----------------------------------------------

    @Plant_User_UI_01
    Scenario: Verify that regular user can successfully search for plants using multiple casing variations (Exact, Lower, Upper, Mixed)
        Given I have logged in to the UI as a regular user
        And I am on the plants page
        When I perform a comprehensive search verification using multiple name casing variations


    @Plant_User_UI_02
    Scenario: Verify that regular user can successfully filter plants to display only specific category on UI
        Given I have logged in to the UI as a regular user
        And I am on the plants page
        When I select a category from the dropdown
        Then only plants from that category should be displayed

    @Plant_User_UI_03
    Scenario: Verify that system displays 'No plants found' message when user applies filter that returns no results
        Given I have logged in to the UI as a regular user
        And I am on the plants page
        When I select a category that has no plants
        Then the No plants found message should be displayed

    @Plant_User_UI_04
    Scenario: Verify that regular user can successfully view paginated plants list with pagination controls on UI
        Given I have logged in to the UI as a regular user
        When I navigate to the plants page
        Then the plants list should be displayed with pagination
        And pagination buttons should be visible

    @Plant_User_UI_05
    Scenario: Verify that regular user can successfully sort plants by name in both ascending and descending order on UI
        Given I have logged in to the UI as a regular user
        And I am on the plants page
        When I click on the Name column header
        Then plants should be displayed in alphabetical order
        When I click on the Name column header again
        Then plants should be displayed in reverse alphabetical order

    @Plant_User_UI_06
    Scenario: Verify that 'Low' badge is displayed to regular user when plant quantity is below 5 on UI
        Given I have logged in to the UI as a regular user
        And I am on the plants page
        And plants with quantity less than 5 exist
        Then the Low badge should be displayed for plants with low quantity

    @Plant_User_UI_07
    Scenario: Verify that a User can sort the plants list by price in both ascending and descending order
        Given I have logged in to the UI as a regular user
        And I am on the plants page
        When I click on the Price column header
        Then plants should be sorted by price from lowest to highest
        When I click on the Price column header again
        Then plants should be sorted by price from highest to lowest

    @Plant_User_UI_08
    Scenario: Verify that a User can sort the plants list by quantity in both ascending and descending order
        Given I have logged in to the UI as a regular user
        And I am on the plants page
        When I click on the Quantity column header
        Then plants should be sorted by quantity from lowest to highest
        When I click on the Quantity column header again
        Then plants should be sorted by quantity from highest to lowest

    @Plant_User_UI_09
    Scenario: Verify that the 'Add Plant' button is hidden for non-admin users
        Given I have logged in to the UI as a regular user
        When I navigate to the plants page
        Then the Add Plant button should not be visible

    @Plant_User_UI_10 
    Scenario: Verify that Edit and Delete actions are hidden for non-admin users
        Given I have logged in to the UI as a regular user
        When I navigate to the plants page
        Then Edit icons should not be visible for any plants
        And Delete icons should not be visible for any plants
