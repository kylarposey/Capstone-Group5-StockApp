require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const admin = require("firebase-admin");
const { getFirestore, doc, setDoc } = require("firebase-admin/firestore");

// ✅ Parse JSON safely
let firebaseAdminCredentials;
try {
    firebaseAdminCredentials = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS.replace(/\\n/g, '\n'));
} catch (error) {
    console.error("❌ Failed to parse FIREBASE_ADMIN_CREDENTIALS:", error);
    process.exit(1); // Stop execution if credentials are invalid
}

// ✅ Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(firebaseAdminCredentials),
    });
}

const db = getFirestore();
const app = express();
app.use(express.json()); // Enable JSON body parsing

// ✅ CORS Setup
const corsOptions = {
    origin: ["http://localhost:3000", "https://group5-capstone-project.web.app"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

// 🔹 Root Route
app.get("/", (req, res) => {
    res.send("🚀 Backend is running! Available endpoints: /api/stock, /api/stocks, /api/etfs, /api/crypto, /api/market-cap-stocks");
});

// 🔹 Fetch Stock Data
app.get("/api/stock", async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: "Stock symbol is required" });

    try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

// 🔹 Generate Portfolio
app.post("/api/generatePortfolio", async (req, res) => {
    const { userId, preferences } = req.body;
    if (!userId || !preferences) {
        return res.status(400).json({ error: "Invalid request. User ID and preferences are required." });
    }

    try {
        let selectedStocks = [];
        let selectedETFs = [];
        let selectedCrypto = [];

        // Fetch assets dynamically
        if (preferences.investmentTypes.includes("Growth stocks")) {
            selectedStocks.push(...await searchStocks("growth"));
        }
        if (preferences.investmentTypes.includes("Dividend stocks")) {
            selectedStocks.push(...await searchStocks("dividend"));
        }
        selectedETFs.push(...await searchETFs());
        if (preferences.investmentTypes.includes("Cryptocurrencies")) {
            selectedCrypto.push(...await fetchCrypto(["BTC", "ETH", "SOL"]));
        }

        // Apply exclusions
        selectedStocks = selectedStocks.filter(stock =>
            !preferences.excludeIndustries.includes("Oil & Gas") || !stock.symbol.includes("XOM")
        );

        // ✅ Overwrite generatedPortfolio in Firestore
        const generatedPortfolio = {
            stocks: selectedStocks.slice(0, 5),
            etfs: selectedETFs.slice(0, 3),
            crypto: selectedCrypto.slice(0, 2),
            updatedAt: new Date().toISOString()
        };

        await setDoc(doc(db, "Users", userId), { generatedPortfolio }, { merge: true });

        res.json(generatedPortfolio);
    } catch (error) {
        console.error("Error generating portfolio:", error);
        res.status(500).json({ error: "Failed to generate portfolio" });
    }
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
