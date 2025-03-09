import { Selector } from 'testcafe';

/* fixture('Getting Started')
   .page('https://devexpress.github.io/testcafe/example');

test('My first test', async t => {
   await t
      .typeText('#developer-name', 'John Smith')
      .click('#submit-button')
      .expect(Selector('#article-header').innerText).eql('Thank you, John Smith!');
}); */

//Localhost testing
fixture('Landing Page')
   .page('http://localhost:3000');

test('Check the title', async t => {
   await t
      .expect(Selector('title').innerText).eql('Stock App');
});

