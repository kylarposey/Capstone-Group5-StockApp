// ✅ Mock App.js first
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
  
    it('TID008-Always displays the page header', () => {
      onAuthStateChanged.mockImplementation((_, callback) => {
        callback(null);
        return () => {}; // ✅ fake unsubscribe function
      });
  
      render(<Trending />);
      expect(screen.getByText('Market Trends & News')).toBeInTheDocument();
    });
  
    it('TID009-Renders news from API when user is logged in', async () => {
      const mockUser = { uid: '123' };
  
      onAuthStateChanged.mockImplementationOnce((_, callback) => {
        callback(mockUser);
        return () => {}; // ✅ prevent unsubscribe error
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
  
    it('TID010-Shows loading indicator while fetching', () => {
      onAuthStateChanged.mockImplementation((_, callback) => {
        callback({ uid: '999' });
        return () => {}; // ✅ prevent unsubscribe error
      });
  
      axios.post.mockImplementation(() => new Promise(() => {}));
  
      render(<Trending />);
      expect(screen.getByText(/Fetching market news/i)).toBeInTheDocument();
    });
  });
  