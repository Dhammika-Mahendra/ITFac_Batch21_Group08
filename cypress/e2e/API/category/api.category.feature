@api @category

Feature: Category Access
    I want to manage categories after signing in

    @Cat_Admin_API_01
    Scenario: See all categories as an admin user
        Given I have logged in as an admin user
        When I call the categories get API point
        Then I should receive a 200 status code
        And the response should contain a list of categories

    @Cat_User_API_01
    Scenario: See all categories as a non-admin user
        Given I have logged in as a non-admin user
        When I call the categories get API point
        Then I should receive a 200 status code
        And the response should contain a list of categories