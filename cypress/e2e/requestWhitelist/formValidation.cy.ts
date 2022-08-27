import { cy, before } from 'local-cypress';

const PORT = Cypress.env('PORT') || 3000;
const BASE_URL = `http://localhost:${PORT}`;
describe('a valid form', () => {
	it('passes', () => {
		cy.visit(`${BASE_URL}/whitelist/request`);
		cy.get('[name="nickname"]').type('chanon');
		cy.get('[name="age"]').type('22');
		cy.get('.gender').select(0);
		cy.get('.facebook-input').type('https://www.facebook.com/chanon.art.73').focused();
		cy.get('.submit').focused().click();
	});
});
