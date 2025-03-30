import { renderHook, act, waitForNextUpdate } from '@testing-library/react';
import { useStockData } from '../services/useStockData';
import { fetchStockData } from '../services/fetchStockData';

// Mock the imported fetchStockDdata
jest.mock('../services/fetchStockData');

describe('Use Stock Data', () => {
   beforeEach(() => {
      // Reset all mocks before each test
      jest.clearAllMocks();
      //jest.unmock("../services/fetchStockData");
   });

   it('TID004-Should initialize with default values', () => {
      const { result } = renderHook(() => useStockData());
      
      expect(result.current.ticker).toBe('');
      expect(result.current.stockData).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('');
      expect(result.current.showPopup).toBe(false);
   });

   it('TID005-Should update ticker when setTicker is called', () => {
      const { result } = renderHook(() => useStockData());
      
      act(() => {
      result.current.setTicker('AAPL');
      });
      
      expect(result.current.ticker).toBe('AAPL');
   });


   it('TID006-Should use the fetched then display it', async () => {
      // Mock successful API fetch
      fetchStockData.mockResolvedValueOnce({
      ticker: 'AAPL',
      price: '150.25',
      change: '+1.25',
      changePercent: '+0.84%'
      });
      
      const { result, waitForNextUpdate } = renderHook(() => useStockData());
      
      // Set ticker
      act(() => {
         result.current.setTicker('AAPL');
      });
      
      // Call the fetch function
      await act(async () => {
         result.current.fetchStockPrice();
      });
            
      // Check the final state
      expect(result.current.loading).toBe(false);
      expect(result.current.stockData).toEqual({
         ticker: 'AAPL',
         price: '150.25',
         change: '+1.25',
         changePercent: '+0.84%'
      });
      expect(result.current.showPopup).toBe(true);
      expect(result.current.error).toBe('');
      
      // Check that fetchStockData was called with correct parameters
      // Note: This checks the URL resolution based on NODE_ENV
      expect(fetchStockData).toHaveBeenCalledWith('AAPL', expect.any(String));
   });

   it('TID007-Should handle errors when an invalid stock is entered', async () => {
      // Mock API error
      fetchStockData.mockRejectedValueOnce(new Error('Error fetching stock data'));
      
      const { result, waitForNextUpdate } = renderHook(() => useStockData());
      
      act(() => {
        result.current.setTicker('INVALID');
      });
      
      await act(async() => {
        result.current.fetchStockPrice();
      });
      
      
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Error fetching stock data');
      expect(result.current.showPopup).toBe(false);
      expect(result.current.stockData).toBeNull();
    });

});