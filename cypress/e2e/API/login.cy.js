describe('API Login Test', () => {
  it('should login successfully via API', () => {
    cy.request('POST', 'http://localhost:8080/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
})