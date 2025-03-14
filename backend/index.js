require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

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
    origin: ["http://localhost:3000", "https://group5-capstone-project.web.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

app.get("/", (req, res) => {
    res.send("🚀 Backend is running! API available at /api/stock?symbol=AAPL");
});

app.get("/api/stock", async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) {
        return res.status(400).json({ error: "Stock symbol is required" });
    }

    try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
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
    const { userId, preferences } = req.body;

    if (!userId || !preferences) {
        return res.status(400).json({ error: "Invalid request. User ID and preferences are required." });
    }

    try {
        const selectedPortfolio = { stocks: [], etfs: [], crypto: [] };

        const includesCrypto = preferences.investmentTypes.includes("Cryptocurrencies");

        const investmentCategories = {
            "stocks": {
                type: "stocks",
                symbols: [
                    "AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "AMD", "META", "AMZN",  
                    "KO", "JNJ", "PG", "MCD", "PEP", "WMT", "TGT", "HD",  
                    "O", "VNQ", "SPG", "PLD", "WPC", "IRM", "EQR", "AVB",  
                    "COIN", "MARA", "RIOT", "HIVE", "SI", "BITF", "HUT",  
                    "XOM", "CVX", "COP", "PXD", "OXY", "SLB", "EOG",  
                    "MO", "PM", "BTI", "DEO", "STZ", "BUD", "SAM",  
                    "LMT", "RTX", "NOC", "GD", "BA", "TXT", "HII",  
                    "LVS", "WYNN", "MGM", "CZR", "BYD", "DKNG", "PENN"
                ]
            },
            "etfs": {
                type: "etfs",
                symbols: [
                    "VOO", "SPY", "SCHD", "VTI", "VYM", "IVV", "JEPI", "QQQ",  
                    "XLE", "VDE", "OIH", "IEO", "AMLP",  
                    "VICEX", "YOLO",  
                    "ITA", "XAR", "DFEN", "PPA", "FITE",  
                    "BJK", "BETZ", "JETS",  
                    "BITO", "BLOK", "DAPP", "BITQ", "LEGR"
                ]
            },
            "crypto": {
                type: "crypto",
                symbols: ["BTC", "ETH", "SOL"]
            }
        };

        const exclusionMap = {
            "Oil & Gas": ["XOM", "CVX", "COP", "PXD", "OXY", "SLB", "EOG", "XLE", "VDE", "OIH", "IEO", "AMLP"],
            "Tobacco & Alcohol": ["MO", "PM", "BTI", "DEO", "STZ", "BUD", "SAM", "VICEX", "YOLO"],
            "Weapons & Defense": ["LMT", "RTX", "NOC", "GD", "BA", "TXT", "HII", "ITA", "XAR", "DFEN", "PPA", "FITE"],
            "Gambling & Casinos": ["LVS", "WYNN", "MGM", "CZR", "BYD", "DKNG", "PENN", "BJK", "BETZ", "JETS"],
            "Crypto & Blockchain": ["COIN", "MARA", "RIOT", "HIVE", "SI", "BITF", "HUT", "BITO", "BLOK", "DAPP", "BITQ", "LEGR"]
        };

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
        let availableCrypto = includesCrypto ? investmentCategories["crypto"].symbols : [];

        const portfolioMix = preferences.portfolioMix || "Balanced stocks & ETFs";
        let stockCount, etfCount;
        if (portfolioMix === "Mostly stocks") {
            stockCount = 6; etfCount = 1;
        } else if (portfolioMix === "Balanced stocks & ETFs") {
            stockCount = 3; etfCount = 3;
        } else if (portfolioMix === "Conservative (more ETFs, fewer stocks)") {
            stockCount = 1; etfCount = 5;
        }

        let chosenStocks = pickRandom(availableStocks, stockCount);
        let chosenETFs = pickRandom(availableETFs, etfCount);
        let chosenCrypto = includesCrypto ? pickRandom(availableCrypto, 2) : [];

        for (const symbol of chosenStocks) {
            try {
                const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
                console.log(`Fetching stock: ${symbol}`);
                const stockResponse = await axios.get(url);
                if (stockResponse.data && stockResponse.data["Global Quote"]) {
                    selectedPortfolio.stocks.push(stockResponse.data["Global Quote"]);
                }
            } catch (error) {
                console.error(`Failed to fetch stock ${symbol}:`, error.message);
            }
        }

        for (const symbol of chosenETFs) {
            try {
                const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
                console.log(`Fetching ETF: ${symbol}`);
                const etfResponse = await axios.get(url);
                if (etfResponse.data && etfResponse.data["Global Quote"]) {
                    selectedPortfolio.etfs.push(etfResponse.data["Global Quote"]);
                }
            } catch (error) {
                console.error(`Failed to fetch ETF ${symbol}:`, error.message);
            }
        }

        selectedPortfolio.crypto = includesCrypto ? chosenCrypto : [];

        const userRef = doc(db, "Users", userId);
        await setDoc(userRef, { generatedPortfolio: selectedPortfolio }, { merge: true });
        res.json(selectedPortfolio);

    } catch (error) {
        console.error("Error generating portfolio:", error.message);
        res.status(500).json({ error: "Failed to generate portfolio", details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));