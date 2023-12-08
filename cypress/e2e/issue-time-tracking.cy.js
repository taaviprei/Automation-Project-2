import IssueModal from "../pages/IssueModal";
describe('Issue time tracking', () => {

const originalEstimate = () => cy.contains('Original Estimate (hours)').next();

const getFirstIssue = () => cy.get('[data-testid="list-issue"]').first().click();

const editEstimate = (estimateValue) => IssueModal.getIssueDetailModal().within(() => {
    originalEstimate()
        .click()
        .clear()
        .type(estimateValue)
        .wait(1000)
        .parent().click();
    cy.get(IssueModal.closeDetailModalButton).first().click()
});

const deleteEstimate = () => IssueModal.getIssueDetailModal().within(() => {
    originalEstimate()
        .click()
        .clear()
        .wait(1000)
        .parent().click();
    cy.get(IssueModal.closeDetailModalButton).first().click()
});

    

    it('Should add, edit and delete a time estimation to issue', () => {

        //Create a new issue to test adding a new time estimation (existing issues already had time estimations).
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
        cy.visit(url + '/board?modal-issue-create=true');
        });

        cy.get('[data-testid="modal:issue-create"]').within(() => {      
            cy.get('[data-testid="select:type"]').click();
            cy.get('[data-testid="select-option:Bug"]')
                .trigger('click');                  
            cy.get('.ql-editor').type('TEST_DESCRIPTION');
            cy.get('input[name="title"]').type('TEST_TITLE');
            cy.get('[data-testid="select:userIds"]').click();
            cy.get('[data-testid="select-option:Lord Gaben"]').click();
            cy.get('button[type="submit"]').click();
        });

        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('TEST_TITLE').click();
        });

        editEstimate(10);
            
        getFirstIssue();
        originalEstimate().children().should('have.value', 10);

        editEstimate(20);
        
        getFirstIssue();
        originalEstimate().children().should('have.value', 20);

        deleteEstimate();

        getFirstIssue();
        originalEstimate().children().should('have.value', '');
    });

    it.only('Log time, remove logged time', () => {

        //Create a new issue to test adding a new time estimation (existing issues already had time estimations).
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
        cy.visit(url + '/board?modal-issue-create=true');
        });

        cy.get('[data-testid="modal:issue-create"]').within(() => {      
            cy.get('[data-testid="select:type"]').click();
            cy.get('[data-testid="select-option:Bug"]')
                .trigger('click');                  
            cy.get('.ql-editor').type('TEST_DESCRIPTION');
            cy.get('input[name="title"]').type('TEST_TITLE');
            cy.get('[data-testid="select:userIds"]').click();
            cy.get('[data-testid="select-option:Lord Gaben"]').click();
            cy.get('button[type="submit"]').click();
        });

        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('TEST_TITLE').click();
        });

        editEstimate(10);
        getFirstIssue();
        cy.contains('Time Tracking').next().click();
        cy.contains('[data-testid="modal:tracking"]').should('exist');
    });
});