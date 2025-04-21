import axios from 'axios';
import { fetchDetailedStockData } from '../services/fetchDetailedStockData';

jest.mock('axios'); // Mock the axios library

describe('fetchDetailedStockData', () => {
const apiUrl = 'http://test-api.com/api/stockDetails';

   it('TID022-fetch basic company info for valid ticker', async () => {
      // Mock successful API response
      axios.get.mockResolvedValueOnce({
         data: {
         Symbol: 'AAPL',
         Name: 'Apple Inc.',
         Sector: 'Technology',
         Industry: 'Consumer Electronics',
         Exchange: 'NASDAQ',
         },
      });

      const result = await fetchDetailedStockData('AAPL', apiUrl);

      // Check individual data points
      expect(result.symbol).toEqual('AAPL');
      expect(result.name).toEqual('Apple Inc.');
      expect(result.sector).toEqual('Technology');
      expect(result.industry).toEqual('Consumer Electronics');
      expect(result.exchange).toEqual('NASDAQ');

      // Ensure axios was called with the correct URL
      expect(axios.get).toHaveBeenCalledWith(`${apiUrl}?symbol=AAPL`);
   });

   it('TID023- fetch company financials data for a valid ticker', async () => {
      axios.get.mockResolvedValueOnce({
         data: {
            Symbol: 'AAPL', // Matches the validation in the function
            PERatio: '31.00', // Correct property name
            EPS: '6.3', // Correct property name
            MarketCapitalization: '2959053160000', // Correct property name
            DividendYield: '.0051', // Correct property name
         },
      });
   
      const result = await fetchDetailedStockData('AAPL', apiUrl);
   
      // Check individual data points
      expect(result.symbol).toEqual('AAPL');
      expect(result.PERatio).toEqual('31.00');
      expect(result.EPS).toEqual('6.3');
      expect(result.marketCap).toEqual('2959053160000');
      expect(result.dividendYield).toEqual('.0051');
   });

   it('TID024- fetch company financials data for an invalid ticker', async () => {
      // Mock API response for invalid ticker
      axios.get.mockResolvedValueOnce({
         data: {
            Symbol: 'INVALID', // Invalid ticker
            PERatio: 'N/A',
            EPS: 'N/A',
            MarketCapitalization: 'N/A',
            DividendYield: 'N/A',
         },
      });

      const result = await fetchDetailedStockData('INVALID', apiUrl);

      // Check individual data points
      expect(result.symbol).toEqual('INVALID');
      expect(result.PERatio).toEqual('N/A');
      expect(result.EPS).toEqual('N/A');
      expect(result.marketCap).toEqual('N/A');
      expect(result.dividendYield).toEqual('N/A');
   });

   it('TID025 - fetch company historical data for a valid ticker', async () => {
      axios.get.mockResolvedValueOnce({
         data: {
            Symbol: 'AAPL',
            "52WeekHigh": '150.00',
            "52WeekLow": '120.00',
            "50DayMovingAverage": '135.00',
            "200DayMovingAverage": '130.00',
         },
      });

      const result = await fetchDetailedStockData('AAPL', apiUrl);

      // Check individual data points
      expect(result.symbol).toEqual('AAPL');
      expect(result.fiftyTwoWeekHigh).toEqual('150.00');
      expect(result.fiftyTwoWeekLow).toEqual('120.00');
      expect(result.fiftyDayMovingAvg).toEqual('135.00');
      expect(result.twoHundredDayMovingAvg).toEqual('130.00');
   });

   it('TID026 - fetch analyst ratings data for a valid ticker', async () => {
      axios.get.mockResolvedValueOnce({
         data: {
            Symbol: 'AAPL',
            AnalystTargetPrice: '145.00',
            AnalystRatingBuy: '10',
            AnalystRatingSell: '2',
            AnalystRatingHold: '5',
            AnalystRatingStrongBuy: '8',
            AnalystRatingStrongSell: '1',
         },
      });

      const result = await fetchDetailedStockData('AAPL', apiUrl);

      // Check individual data points
      expect(result.symbol).toEqual('AAPL');
      expect(result.analystTargetPrice).toEqual('145.00');
      expect(result.analystRatingBuy).toEqual('10');
      expect(result.analystRatingSell).toEqual('2');
      expect(result.analystRatingHold).toEqual('5');
      expect(result.analystRatingStrongBuy).toEqual('8');
      expect(result.analystRatingStrongSell).toEqual('1');
   });

});