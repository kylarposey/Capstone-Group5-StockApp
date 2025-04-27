import { Selector, ClientFunction, Role } from 'testcafe';

//Localhost testing
fixture('Landing Page')
   .page('http://localhost:3000');


const getPageUrl = ClientFunction(() => window.location.href);


test('Check the title-Initial Sample Test', async t => {
   await t
      .expect(Selector('title').innerText).eql('Stock App');
});

test('Search for a stock1 - with success', async t => {
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

test('Search for a stock2 - with success', async t => {
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

test('Search for invalid - ticker not found', async t => {
   const tickerSearchInput = Selector('#ticker-search-input');
   const tickerSearchButton = Selector('#ticker-search-button');
   const errorParagraph = Selector('.error-banner');

   await t
      .typeText(tickerSearchInput, 'QWERTASDF')
      .click(tickerSearchButton)
      .expect(errorParagraph.exists).ok({ timeout: 5000 })
      .expect(errorParagraph.innerText).contains('Invalid Ticker or API Error');
});

test('Navigate to About page', async t => {
   // Select the About link using the id
   
   const aboutLink = Selector('#about-link');

   // Click the About link
   await t
      .click(aboutLink)
      .expect(getPageUrl()).contains('about');
});

test('Navigate back to Home page', async t => {
   // Select the About link using the id
   const homeLink = Selector('#home');

   // Click the About link
   await t
      .click(homeLink)
      .expect(getPageUrl()).eql('http://localhost:3000/');
});

test('Navigate to Login page', async t => {
   // Select the About link using the id
   const loginRegisterLink = Selector('#login-register-link');
   //console.log('loginRegisterLink', loginRegisterLink);

   // Click the About link
   await t
      .click(loginRegisterLink)
      .expect(getPageUrl()).contains('loginRegister');
});

test('Navigate back to Home page', async t => {
   // Select the About link using the id
   const homeLink = Selector('#home');

   // Click the About link
   await t
      .click(homeLink)
      .expect(getPageUrl()).eql('http://localhost:3000/');
});

