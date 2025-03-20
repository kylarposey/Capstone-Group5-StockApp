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

test('Check the title-Initial Sample Test', async t => {
   await t
      .expect(Selector('title').innerText).eql('Stock App');
});

test('Search for a stock1', async t => {
   const tickerSearchInput = Selector('#ticker-search-input');
   const tickerSearchButton = Selector('#ticker-search-button');
   const popup = Selector('#stock-popup');
   const stockTicker = Selector('.popup-title');
   await t
      .typeText(tickerSearchInput, 'AAPL')
      .click(tickerSearchButton)
      .expect(popup.exists).ok()
      .expect(stockTicker.innerText).eql('AAPL');
});

test('Search for a stock2', async t => {
   const tickerSearchInput = Selector('#ticker-search-input');
   const tickerSearchButton = Selector('#ticker-search-button');
   const popup = Selector('#stock-popup');
   const stockTicker = Selector('.popup-title');
   await t
      .typeText(tickerSearchInput, 'GOOG')
      .click(tickerSearchButton)
      .expect(popup.exists).ok()
      .expect(stockTicker.innerText).eql('GOOG');
});