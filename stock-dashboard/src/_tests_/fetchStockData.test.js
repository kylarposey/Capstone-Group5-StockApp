import axios from 'axios';
import { fetchStockData } from '../services/fetchStockData';

// Mock axios so we don't make actual API calls
jest.mock('axios');

describe('Fetch Stock Data', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('TID001-Should fetch stock data successfully', async () => {
    // Mock successful API response
    axios.get.mockResolvedValueOnce({
      data: {
        "Global Quote": {
          "01. symbol": "AAPL",
          "05. price": "150.25",
          "09. change": "+1.25",
          "10. change percent": "+0.84%"
        }
      }
    });

    const result = await fetchStockData('AAPL', 'http://test-api.com/api/stock');

    // Check if axios was called with correct URL
    expect(axios.get).toHaveBeenCalledWith('http://test-api.com/api/stock?symbol=AAPL');
    
    // Check if the result is correct
    expect(result).toEqual({
      ticker: "AAPL",
      price: "150.25",
      change: "+1.25",
      changePercent: "+0.84%"
    });
  });

  it('TID002-Should throw error when invalid stock ticker is searched for', async () => {
    // Mock API response with invalid data
    axios.get.mockResolvedValueOnce({
      data: { somethingElse: true }
    });

    // Test that the function throws an error
    await expect(fetchStockData('ABCXYZ', 'http://test-api.com/api/stock'))
      .rejects
      .toThrow('Invalid Ticker or API Error');
  });

  it('TID003-Should throw error when API call fails', async () => {
    // Mock API call failure
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchStockData('AAPL', 'http://test-api.com/api/stock'))
      .rejects
      .toThrow('Error fetching stock data');
  });
});