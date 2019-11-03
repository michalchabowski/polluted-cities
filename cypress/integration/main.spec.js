describe('Polluted cities app', () => {
  it('contains country selector', () => {
    cy.visit('/');
    cy.contains('Choose a country');

    cy.server();
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=1', 'fixture:measurements_PL_p1.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=2', 'fixture:measurements_PL_p2.json');
    cy.get('[data-cy=country-input]').type('Poland{enter}');
    // TODO add lag to request so loader can be visible
    // cy.get('[data-cy=main-loader]');

    cy.get('[data-cy=accordion-Radomsko]');
    cy.get('[data-cy=accordion-Rybnik]');
  });

  it('fetches city description', () => {
    cy.visit('/');
    cy.server();
    cy.route('GET', '/wikipedia?cityName=Guadalajara', 'fixture:guadalajara_wikipedia.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=1', 'fixture:measurements_ES_p1.json');
    cy.get('[data-cy=country-input]').type('Spain{enter}');

    cy.get('[data-cy=accordion-Guadalajara]').as('accordion').click();

    cy.get('[data-cy=accordion-Guadalajara-desc]').contains('Pre-Moorish Invasion and settlements');
  });
});
