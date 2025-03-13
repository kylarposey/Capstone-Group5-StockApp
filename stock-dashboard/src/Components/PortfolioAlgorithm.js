import axios from "axios";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

const portfolioAlgorithm = async (userId, preferences) => {
    const portfolio = { stocks: [], etfs: [], crypto: [], bonds: [] };

    try {
        if (preferences.investmentTypes.includes("Growth stocks")) {
            const response = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=growth&apikey=${API_KEY}`);
            portfolio.stocks = response.data.bestMatches.slice(0, 3);
        }

        if (preferences.investmentTypes.includes("ETFs & Index funds")) {
            const etfResponse = await axios.get(`https://www.alphavantage.co/query?function=ETF_SEARCH&keywords=index&apikey=${API_KEY}`);
            portfolio.etfs = etfResponse.data.bestMatches.slice(0, 2);
        }

        if (preferences.investmentTypes.includes("Cryptocurrencies")) {
            const cryptoResponse = await axios.get(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${API_KEY}`);
            portfolio.crypto = [{ symbol: "BTC", price: cryptoResponse.data["Time Series (Digital Currency Daily)"]["1a. open (USD)"] }];
        }

        const userRef = doc(db, "Users", userId);
        await updateDoc(userRef, { generatedPortfolio: portfolio });

    } catch (error) {
        console.error("Error generating portfolio:", error);
    }
};

export default portfolioAlgorithm;
