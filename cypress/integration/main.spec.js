describe('Polluted cities app', () => {
  it('contains country selector', () => {
    cy.visit('/');
    cy.contains('Choose a country');

    cy.server();
    cy.route('GET', '/wikipedia?cityName=Guadalajara', 'fixture:guadalajara_wikipedia.json');
    cy.get('[data-cy=accordion-Guadalajara]').as('accordion').click();

    cy.get('[data-cy=accordion-Guadalajara-desc]').contains('Pre-Moorish Invasion and settlements');
  });
});
