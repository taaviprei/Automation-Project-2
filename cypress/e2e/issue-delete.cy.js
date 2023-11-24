describe('Issue deleting', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
      });
      cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    });

    it('Test Case 1: Issue Deletion', () => {
        cy.get('[data-testid="icon:trash"]').click();
        cy.get('[data-testid="modal:confirm"]').should('be.visible').contains('Are you sure you want to delete this issue?');
        cy.contains('Delete issue').click();
        cy.contains('Are you sure you want to delete this issue?').should('not.exist');
        cy.reload();
        cy.contains('This is an issue of type: Task.').should('not.exist');
    })

    it('Test Case 2: Issue Deletion Cancellation', () => {
        cy.get('[data-testid="icon:trash"]').click();
        cy.get('[data-testid="modal:confirm"]').should('be.visible').contains('Are you sure you want to delete this issue?');
        cy.contains('Cancel').click();
        cy.contains('Are you sure you want to delete this issue?').should('not.exist');
        cy.reload();
        cy.contains('This is an issue of type: Task.').should('be.visible');
    })
});