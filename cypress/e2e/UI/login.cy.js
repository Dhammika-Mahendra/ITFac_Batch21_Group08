describe('Login Test', () => {
  it('should login successfully', () => {
    cy.visit('http://localhost:8080/ui/login')

    cy.get('input[name="username"]').type('admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()

    cy.url().should('eq', 'http://localhost:8080/ui/dashboard')
  })
})