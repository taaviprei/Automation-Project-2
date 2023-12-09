describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
          .trigger('mouseover')
          .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

  it('Should check "Priority" dropdown', () => {
    const expectedLength = 5;
    let priorityArray = [];

    cy.get('[data-testid="select:priority"]').invoke('text').then ((defaultPriority) => {
      priorityArray.push(defaultPriority);
      cy.log(defaultPriority);
    });

    cy.get('[data-testid="select:priority"]').click();

    cy.get('[data-select-option-value]').then(($options) => {
      const itemCount = Cypress.$($options).length;

      for (let index = 0; index < itemCount; index++) {
        cy.get('[data-select-option-value]')
          .eq(index).invoke('text').then((extractedPriority) => {
            priorityArray.push(extractedPriority);

            if (index == (itemCount - 1)) {
              cy.log("TOTAL calculated array length: " + priorityArray.length);
              expect(priorityArray.length).to.be.eq(expectedLength);
            }
          });
      };
    });
  });

  it('Check that reporters name has only characters in it', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:reporter"]').invoke('text')
      .should('match', /^[A-Za-z ]*$/);
    });     
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
});
