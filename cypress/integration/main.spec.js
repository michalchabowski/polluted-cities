describe('Polluted cities app', () => {
  it('fetches 10 most polluted cities', () => {
    cy.visit('/');
    cy.contains('Choose a country');

    cy.server();
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=1*', 'fixture:measurements_PL_p1.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=2*', 'fixture:measurements_PL_p2.json');

    cy.get('[data-cy=country-input]').type('Poland{enter}');
    // TODO add lag to request so loader can be visible
    // cy.get('[data-cy=main-loader]');

    // result from first page
    cy.get('[data-cy=accordion-item-Radomsko]');
    // result from second page
    cy.get('[data-cy=accordion-item-Rybnik]');
    cy.get('[data-cy^=accordion-item').should('have.length', 10);
  });

  it('handles cities fetching error by showing message', () => {
    cy.visit('/');
    cy.server();
    cy.route({
      method: 'GET',
      url: 'https://api.openaq.org/v1/measurements?**',
      status: 500,
      response: 'Server Error',
    });

    cy.get('[data-cy=country-input]').type('Poland{enter}');

    cy.contains('We\'re sorry');
  });

  it('remembers selected country between page reloads', () => {
    cy.visit('/');
    cy.server();
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=1*', 'fixture:measurements_PL_p1.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=2*', 'fixture:measurements_PL_p2.json');
    cy.get('[data-cy=country-input]').type('Poland{enter}');

    cy.visit('/');

    cy.get('[data-cy=country-input]').get('input').should('have.value', 'Poland');
    cy.get('[data-cy=accordion-item-Radomsko]');
  });

  it('fetches city description', () => {
    cy.visit('/');
    cy.server();
    cy.route('GET', 'https://en.wikipedia.org/w/api.php**', 'fixture:guadalajara_wikipedia.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=1*', 'fixture:measurements_ES_p1.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=2*', 'fixture:measurements_ES_p2.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=3*', 'fixture:measurements_ES_p3.json');
    cy.get('[data-cy=country-input]').type('Spain{enter}');

    cy.get('[data-cy=accordion-item-Murcia]').click();

    cy.get('[data-cy=accordion-content-Murcia]').contains('Pre-Moorish Invasion and settlements');
  });

  it('handles fetching description error by showing message', () => {
    cy.visit('/');
    cy.server();
    cy.route('GET', 'https://en.wikipedia.org/w/api.php**', 'fixture:wikipedia_no_results.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=1*', 'fixture:measurements_PL_p1.json');
    cy.route('GET', 'https://api.openaq.org/v1/measurements?**page=2*', 'fixture:measurements_PL_p2.json');
    cy.get('[data-cy=country-input]').type('Poland{enter}');

    cy.get('[data-cy=accordion-item-Radomsko').click();

    cy.get('[data-cy=accordion-content-Radomsko]').contains('We\'re sorry');
  });
});
