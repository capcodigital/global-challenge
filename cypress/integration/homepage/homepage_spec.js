describe('Homepage test', function() {
  it('Button works', function() {
    cy.visit('http://localhost:3000/');
    cy.get('#sample1Button').then(el => {
      el.click();

      cy.get('#sample1Button_message').then(el_message => {
        assert.include(el_message.text(), 'Sample component');
      });
    });
  });
});
