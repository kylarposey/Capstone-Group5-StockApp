require("dotenv").config();
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
    origin: "*", 
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
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

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
                    // 📈 Growth Stocks (Aggressive)
                    "AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "AMD", "META", "AMZN", "SHOP", "SNOW",
                    "UBER", "RBLX", "SQ", "NET", "CRWD", "DDOG", "MDB", "ZS", "DOCU", "ASAN",
                    "COIN", "MARA", "RIOT", "HIVE", "SI", "BITF", "HUT", "GBTC", "ETHE", "MSTR",
        
                    // 💰 Dividend Stocks (Conservative)
                    "KO", "JNJ", "PG", "MCD", "PEP", "WMT", "TGT", "HD", "VZ", "T", "D", "SO", "DUK",
                    "XEL", "AEP", "ED", "GIS", "KMB", "CL", "COST", "LOW", "USB", "PNC", "TFC", "LMT", "RTX",
        
                    // 🏠 REITs (Moderate/Conservative)
                    "O", "VNQ", "SPG", "PLD", "WPC", "IRM", "EQR", "AVB", "MAA", "PEAK", "BXP", "SLG",
                    "CPT", "ARE", "MPW", "VICI", "STAG", "EXR", "PSA", "CUBE",
        
                    // 🛢 Oil & Gas (Moderate/Conservative)
                    "XOM", "CVX", "COP", "PXD", "OXY", "SLB", "EOG", "HES", "MPC", "PSX", "VLO", "DVN", "FANG",
        
                    // 🚬 Tobacco & Alcohol (Conservative/Moderate)
                    "MO", "PM", "BTI", "DEO", "STZ", "BUD", "SAM", "CCU", "TAP", "BF.B",
        
                    // 🛡 Weapons & Defense (Moderate/Conservative)
                    "LMT", "RTX", "NOC", "GD", "BA", "TXT", "HII", "CW", "AXON", "LHX", "HEI",
        
                    // 🎰 Gambling & Casinos (Moderate/Aggressive)
                    "LVS", "WYNN", "MGM", "CZR", "BYD", "DKNG", "PENN", "BALY", "RSI", "MCRI",
        
                    // 🚗 Automakers & EV (Aggressive/Moderate)
                    "F", "GM", "RIVN", "LCID", "NIO", "XPEV", "FSR", "TSLA", "STLA",
        
                    // 🔬 Biotech & Pharma (Moderate/Aggressive)
                    "MRNA", "BNTX", "REGN", "VRTX", "BIIB", "LLY", "PFE", "ABBV", "GILD", "BMY", "AMGN",
        
                    // 🏦 Financials & Banks (Conservative/Moderate)
                    "JPM", "BAC", "WFC", "C", "MS", "GS", "USB", "PNC", "TFC", "SCHW", "AMP", "RY", "TD", "BNS",
        
                    // 🏛️ Infrastructure & Industrials (Moderate)
                    "CAT", "DE", "EMR", "HON", "GE", "NUE", "DOW", "X", "FCX", "LIN", "ETN", "CMI"
                ]
            },
        
            "etfs": {
                type: "etfs",
                symbols: [
                    // 🏛️ Large-Cap ETFs (Conservative/Moderate)
                    "VOO", "SPY", "IVV", "VTI", "SCHD", "VYM", "DIA", "VIG", "FNDX",
        
                    // 📊 Growth & Tech ETFs (Aggressive/Moderate)
                    "QQQ", "ARKK", "ARKW", "VGT", "XLC", "FTEC", "XLK", "IYW", "FDN",
        
                    // 💰 Dividend & Income ETFs (Conservative)
                    "JEPI", "JEPQ", "DVY", "NOBL", "VYM", "SPYD", "SDY", "HDV", "SCHY",
        
                    // 🛢 Oil & Gas ETFs (Conservative/Moderate)
                    "XLE", "VDE", "OIH", "IEO", "AMLP", "USO", "BNO",
        
                    // 🚬 Vice ETFs (Moderate)
                    "VICEX", "YOLO",
        
                    // 🛡 Defense ETFs (Moderate/Conservative)
                    "ITA", "XAR", "DFEN", "PPA", "FITE",
        
                    // 🎰 Gambling ETFs (Moderate/Aggressive)
                    "BJK", "BETZ", "JETS",
        
                    // 💎 Crypto & Blockchain ETFs (Aggressive)
                    "BITO", "BLOK", "DAPP", "BITQ", "LEGR", "GBTC", "ETHE", "WGMI",
        
                    // 🔬 Healthcare & Biotech ETFs (Moderate)
                    "XLV", "IBB", "VHT", "XBI", "ARKG",
        
                    // 🌍 International & Emerging Markets (Moderate)
                    "VXUS", "VEA", "EFA", "EEM", "VWO", "EWZ", "FXI", "INDA",
        
                    // 🏠 REITs & Real Estate ETFs (Conservative)
                    "VNQ", "SCHH", "XLRE", "IYR", "REZ", "FREL", "RWR", "IYR",
        
                    // 🚗 EV & Renewable Energy ETFs (Aggressive/Moderate)
                    "LIT", "TAN", "PBW", "ICLN", "QCLN",
        
                    // 🏗️ Industrials & Infrastructure ETFs (Moderate)
                    "XLI", "PAVE", "VIS", "IGE", "IFRA"
                ]
            },
        
            "crypto": {
                type: "crypto",
                symbols: ["BTC", "ETH", "SOL", "ADA", "XRP", "DOT", "MATIC", "AVAX", "LTC", "DOGE", "UNI", "LINK"]
            }
        };
        
        const riskToleranceFilter = {
            "Conservative": new Set([
                "KO", "JNJ", "PG", "MCD", "PEP", "WMT", "VNQ", "SCHD", "D", "SO", "DUK", "XEL", "AEP", "ED",
                "USB", "PNC", "TFC", "LMT", "RTX", "NOBL", "VYM", "SPYD", "XLV", "VNQ", "XLRE"
            ]),
    
            "Moderate": new Set([
                "XOM", "CVX", "RTX", "NOC", "GD", "DE", "CAT", "HON", "VICI", "ARE", "BMY", "GS", "MS", "JETS",
                "ITA", "XAR", "DFEN", "PPA", "XLI", "PAVE", "IGE", "IBB", "VHT", "VXUS", "VEA", "EFA"
            ]),
    
            "Aggressive": new Set([
                "AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "COIN", "MARA", "RIOT", "SHOP", "SNOW", "RBLX", "SQ",
                "ARKK", "ARKW", "VGT", "XLK", "LIT", "TAN", "PBW", "ICLN", "BITO", "BLOK", "DAPP", "XLC"
            ])
        };

        const exclusionMap = {
            "Oil & Gas": ["XOM", "CVX", "COP", "PXD", "OXY", "SLB", "EOG"],
            "Tobacco & Alcohol": ["MO", "PM", "BTI", "DEO", "STZ"],
            "Weapons & Defense": ["LMT", "RTX", "NOC", "GD"],
            "Gambling & Casinos": ["LVS", "WYNN", "MGM", "CZR"],
            "Crypto & Blockchain": ["COIN", "MARA", "RIOT", "BITO", "BLOK"]
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

        if (preferences.riskTolerance) {
            availableStocks = availableStocks.filter(stock => riskToleranceFilter[preferences.riskTolerance].has(stock));
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

app.post("/api/trending-news", async (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));