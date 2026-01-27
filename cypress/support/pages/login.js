class LoginPage {
  get usernameInput() {
    return cy.get('input[name="username"]');
  }

  get passwordInput() {
    return cy.get('input[name="password"]');
  }

  get loginBtn() {
    return cy.get('button[type="submit"]');
  }

  visitLoginPage() {
    cy.visit(Cypress.env("BASE_URL") + "/ui/login");
  }

  login(username, password) {
    this.usernameInput.type(username);
    this.passwordInput.type(password);
    this.loginBtn.click();
  }

}

class loginAPI{

  loginAPIRequest(username, password){
    return cy.request({
      method: 'POST',
      url: Cypress.env("BASE_URL") + '/api/auth/login',
      body: {
        username: username,
        password: password
      },
      failOnStatusCode: false
    });
  } 

  getAuthToken(username, password) {
    return this.loginAPIRequest(username, password).then((response) => {
      expect(response.status, "login API should succeed").to.eq(200);
      this.validateTokenResponse(response.body);
      return response.body.token;
    });
  }

  validateTokenResponse(json) {
    expect(json.token, "token should be present").to.be.a("string").and.not.be
      .empty;
    expect(json.tokenType, "tokenType should be present").to.be.a("string").and
      .not.be.empty;
  }
  
}

export const loginPage = new LoginPage();
export const loginApi = new loginAPI();