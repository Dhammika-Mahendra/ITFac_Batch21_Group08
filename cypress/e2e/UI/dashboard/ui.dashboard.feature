@ui @dashboard
Feature: Dashboard Access
    As an authenticated user
    I want to reach the dashboard after signing in
    So that I can monitor the system

    @Dash_User_UI_01
    Scenario: Dashboard loads 
        Given I open the login page
        When I sign in with valid credentials
        Then I should be redirected to the dashboard
        And the dashboard navigation menu should be visible

    