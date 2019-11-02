describe('Polluted cities app', () => {
  it('contains country selector', () => {
    cy.visit('/');
    cy.contains('Choose a country');
  });
});
