require("dotenv").config();
const data = require("./data/investment-categories.json");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
app.use(cors({
    origin: "*", //NOT SECURE FOR PRODUCTION / FIXME 
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

// Handle preflight requests
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(200);
});

const ALPHA_VANTAGE_API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

app.get("/", (req, res) => {
    res.send("🚀 Backend is running! API available at /api/stock?symbol=AAPL");
});

app.get("/api/stock", async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) {
        return res.status(400).json({ error: "Stock symbol is required" });
    }

    try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

app.use(express.json());

const pickRandom = (array, count) => {
    let shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

app.post("/api/generatePortfolio", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    const { userId, preferences } = req.body;  //NOT SECURE

    if (!userId || !preferences) {
        return res.status(400).json({ error: "Invalid request. User ID and preferences are required." });
    }

    try {
        const selectedPortfolio = { stocks: [], etfs: [], crypto: [] };
        const includesCrypto = preferences.investmentTypes.includes("Cryptocurrencies");
        
        const investmentCategories = data.investmentCategories;
        const exclusionMap = data.exclusionMap;
        const riskToleranceFilter = data.riskToleranceFilter;

        let excludedSymbols = new Set();
        if (preferences.excludeIndustries) {
            for (let industry of preferences.excludeIndustries) {
                if (exclusionMap[industry]) {
                    exclusionMap[industry].forEach(symbol => excludedSymbols.add(symbol));
                }
            }
        }

        let availableStocks = investmentCategories["stocks"].symbols.filter(symbol => !excludedSymbols.has(symbol));
        let availableETFs = investmentCategories["etfs"].symbols.filter(symbol => !excludedSymbols.has(symbol));

        if (preferences.riskTolerance) {
            availableStocks = availableStocks.filter(stock => riskToleranceFilter[preferences.riskTolerance].includes(stock)); //for array data filtering
        }

        const portfolioMix = preferences.portfolioMix || "Balanced stocks & ETFs";
        let stockCount, etfCount;
        if (portfolioMix === "Mostly stocks") {
            stockCount = 6; etfCount = 1;
        } else if (portfolioMix === "Balanced stocks & ETFs") {
            stockCount = 3; etfCount = 3;
        } else if (portfolioMix === "Conservative (more ETFs, fewer stocks)") {
            stockCount = 1; etfCount = 5;
        }

        selectedPortfolio.stocks = pickRandom(availableStocks, stockCount);
        selectedPortfolio.etfs = pickRandom(availableETFs, etfCount);
        selectedPortfolio.crypto = includesCrypto ? pickRandom(investmentCategories["crypto"].symbols, 2) : [];
        

        async function fetchStockChange(symbol) {
            try {
                console.log(`🔄 Fetching data for: ${symbol}`);
                const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
                const response = await axios.get(url);
                const data = response.data["Global Quote"];

                if (!data || !data["10. change percent"]) {
                    console.warn(`⚠ No valid data for ${symbol}`);
                }

                return {
                    symbol,
                    changePercent: data ? data["10. change percent"] : "N/A",
                };
            } catch (error) {
                console.error(`🔥 Error fetching ${symbol}:`, error.message);
                return { symbol, changePercent: "N/A" };
            }
        }

        async function fetchCryptoChange(symbol) {
            try {
                console.log(`🔄 Fetching crypto data for: ${symbol}`);
                const url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=EUR&apikey=${ALPHA_VANTAGE_API_KEY}`;
                const response = await axios.get(url);
                const data = response.data["Time Series (Digital Currency Daily)"];
        
                if (!data) {
                    console.warn(`⚠ No valid data for ${symbol}`);
                    return { symbol, changePercent: "N/A" };
                }
        
                const dates = Object.keys(data);
                if (dates.length < 2) {
                    console.warn(`⚠ Not enough data for ${symbol}`);
                    return { symbol, changePercent: "N/A" };
                }
        
                const latestDate = dates[0];
                const previousDate = dates[1];
        
                const latestClose = parseFloat(data[latestDate]["4. close"]);
                const previousClose = parseFloat(data[previousDate]["4. close"]);
        
                const changePercent = (((latestClose - previousClose) / previousClose) * 100).toFixed(2) + "%";
        
                return { symbol, changePercent };
            } catch (error) {
                console.error(`🔥 Error fetching ${symbol}:`, error.message);
                return { symbol, changePercent: "N/A" };
            }
        }

        const updatedStocks = await Promise.all(selectedPortfolio.stocks.map(fetchStockChange));
        const updatedETFs = await Promise.all(selectedPortfolio.etfs.map(fetchStockChange));
        const updatedCrypto = await Promise.all(selectedPortfolio.crypto.map(fetchCryptoChange));

        console.log("✅ Updated Stocks Data:", updatedStocks);
        console.log("✅ Updated ETFs Data:", updatedETFs);

        const finalPortfolio = { 
            stocks: updatedStocks, 
            etfs: updatedETFs, 
            crypto: updatedCrypto 
        };

        await setDoc(doc(db, "Users", userId), { generatedPortfolio: finalPortfolio }, { merge: true });

        console.log(`✅ Portfolio saved successfully for User ID: ${userId}`);
        res.json(finalPortfolio);
    } catch (error) {
        console.error("🔥 Error generating portfolio:", error.message);
        res.status(500).json({ error: "Failed to generate portfolio", details: error.message });
    }
});

const fetchMarketNews = async (symbol) => {
    try {
        const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        const response = await axios.get(url);
        return response.data.feed || [];
    } catch (error) {
        console.error(`Error fetching news for ${symbol}:`, error);
        return [];
    }
};

app.post("/api/trendingNews", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const userRef = doc(db, "Users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = userDoc.data();
        const portfolio = userData.generatedPortfolio || {};
        const investmentTypes = userData.portfolio?.investmentTypes || [];

        let tickers = [
            ...(portfolio.stocks || []).map(stock => stock.symbol),
            ...(portfolio.etfs || []).map(etf => etf.symbol),
            ...(portfolio.crypto || [])
        ];

        tickers = [...new Set(tickers)].slice(0, 6);
        console.log("Fetching news for tickers:", tickers);

        let newsArticles = [];
        for (const ticker of tickers) {
            try {
                const response = await axios.get(`https://www.alphavantage.co/query`, {
                    params: {
                        function: "NEWS_SENTIMENT",
                        tickers: ticker,
                        apikey: ALPHA_VANTAGE_API_KEY
                    }
                });
                if (response.data && response.data.feed) {
                    newsArticles.push(...response.data.feed.slice(0, 2));
                }
            } catch (error) {
                console.error(`🔥 Error fetching news for ${ticker}:`, error.message);
            }
        }

        if (newsArticles.length < 9) {
            console.log("Fetching additional news based on user preferences...");

            const categories = {
                "Growth stocks": "growth investing",
                "Dividend stocks": "dividend investing",
                "ETFs": "exchange traded funds",
                "Cryptocurrencies": "crypto market",
                "REITs": "real estate investing"
            };

            const selectedCategories = investmentTypes
                .filter(type => categories[type])
                .map(type => categories[type]);

            for (const category of selectedCategories) {
                try {
                    const response = await axios.get(`https://www.alphavantage.co/query`, {
                        params: {
                            function: "NEWS_SENTIMENT",
                            topics: category,
                            apikey: ALPHA_VANTAGE_API_KEY
                        }
                    });

                    if (response.data && response.data.feed) {
                        newsArticles.push(...response.data.feed.slice(0, 3));
                    }
                } catch (error) {
                    console.error(`🔥 Error fetching category news for ${category}:`, error.message);
                }

                if (newsArticles.length >= 9) break;
            }
        }

        console.log(`✅ Total news articles fetched: ${newsArticles.length}`);
        res.json({ news: newsArticles });
    } catch (error) {
        console.error("🔥 Error fetching trending news:", error.message);
        res.status(500).json({ error: "Failed to fetch trending news", details: error.message });
    }
});

const PORT = process.env.PORT || 5001;

/* Alternate port
const PORT = process.env.PORT || 5000;
 */
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));