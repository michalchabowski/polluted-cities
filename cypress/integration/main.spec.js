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

  it('remembers selected country between page reloads', () => {
    cy.visit('/');
    cy.server();
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=1', 'fixture:measurements_PL_p1.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=2', 'fixture:measurements_PL_p2.json');
    cy.get('[data-cy=country-input]').type('Poland{enter}');

    cy.visit('/');

    cy.get('[data-cy=country-input]').get('input').should('have.value', 'Poland');
  });

  it('fetches city description', () => {
    cy.visit('/');
    cy.server();
    cy.route('GET', 'https://en.wikipedia.org/w/api.php**', 'fixture:guadalajara_wikipedia.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=1', 'fixture:measurements_ES_p1.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=2', 'fixture:measurements_ES_p2.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=3', 'fixture:measurements_ES_p3.json');
    cy.get('[data-cy=country-input]').type('Spain{enter}');

    cy.get('[data-cy=accordion-Murcia]').as('accordion').click();

    cy.get('[data-cy=accordion-Murcia-desc]').contains('Pre-Moorish Invasion and settlements');
  });

  it('handles fetching description error by showing message', () => {
    cy.visit('/');
    cy.server();
    cy.route('GET', 'https://en.wikipedia.org/w/api.php**', 'fixture:wikipedia_no_results.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=1', 'fixture:measurements_PL_p1.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=2', 'fixture:measurements_PL_p2.json');
    cy.get('[data-cy=country-input]').type('Poland{enter}');

    cy.get('[data-cy=accordion-Radomsko').as('accordion').click();

    cy.get('[data-cy=accordion-Radomsko-desc]').contains('We\'re sorry');
  });
});
