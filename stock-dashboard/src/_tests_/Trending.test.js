jest.mock('../App', () => {
    const React = require('react');
    return {
      NotificationContext: React.createContext({ addNotification: () => {} }),
    };
  });
  
  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import '@testing-library/jest-dom';
  import axios from 'axios';
  import Trending from '../Components/Trending';
  
  jest.mock('firebase/auth', () => ({
    onAuthStateChanged: jest.fn(),
  }));
  import { onAuthStateChanged } from 'firebase/auth';
  
  jest.mock('../firebase', () => ({
    auth: {},
  }));
  
  jest.mock('axios');
  
  describe('Trending Component', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('always displays the page header', () => {
      onAuthStateChanged.mockImplementation((_, callback) => {
        callback(null);
        return () => {};
      });
  
      render(<Trending />);
      expect(screen.getByText('Market Trends & News')).toBeInTheDocument();
    });
  
    it('renders news from API when user is logged in', async () => {
      const mockUser = { uid: '123' };
  
      onAuthStateChanged.mockImplementationOnce((_, callback) => {
        callback(mockUser);
        return () => {};
      });
  
      axios.post.mockResolvedValueOnce({
        data: {
          news: [
            {
              title: 'Big Stock Win!',
              summary: 'Market moves big today...',
              url: 'https://example.com/news',
              tickers: ['SPY'],
            },
          ],
        },
      });
  
      render(<Trending />);
  
      expect(await screen.findByText('Big Stock Win!')).toBeInTheDocument();
      expect(screen.getByText('Market moves big today...')).toBeInTheDocument();
      expect(screen.getByText('Read More')).toHaveAttribute('href', 'https://example.com/news');
    });
  
    it('shows loading indicator while fetching', () => {
      onAuthStateChanged.mockImplementation((_, callback) => {
        callback({ uid: '999' });
        return () => {};
      });
  
      axios.post.mockImplementation(() => new Promise(() => {}));
  
      render(<Trending />);
      expect(screen.getByText(/Fetching market news/i)).toBeInTheDocument();
    });
  });
  