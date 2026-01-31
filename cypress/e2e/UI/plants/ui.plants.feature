@ui @plants

Feature: Plant Management UI
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
        And the Add Plant button should be visible
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

    #----------------------------------------------
    #          Regular User Scenarios
    #----------------------------------------------

    @Plant_User_UI_01
    Scenario: Verify that regular user can successfully search for plants by entering partial or full plant name in search field
        Given I have logged in to the UI as a regular user
        And I am on the plants page
        When I enter partial plant name in search field
        And I click the search button
        Then only matching plants should be displayed

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
