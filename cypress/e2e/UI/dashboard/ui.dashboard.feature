@ui @dashboard
Feature: Dashboard Access
    As an authenticated user
    I want to reach the dashboard after signing in
    So that I can monitor the system

    @Dash_Admin_UI_01
    Scenario: Admin can see the dashboard with all necessary basic components after a succesful login
        Given I open the login page
        When I sign in with valid admin user credentials
        Then I should be redirected to the dashboard
        And Navigation menu highlights the active pages
        And Category, Plants and Sales summary information will be displayed

    @Dash_User_UI_01
    Scenario: User can see the dashboard with all necessary basic components after a succesful login
        Given I open the login page
        When I sign in with valid non-admin user credentials
        Then I should be redirected to the dashboard
        And Navigation menu highlights the active pages
        And Category, Plants and Sales summary information will be displayed

    