const express = require("express");
const router = express.Router();
const axios = require("axios");

const ALPHA_VANTAGE_API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

router.get("/stockDetails", async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: "Stock symbol is required" });

    try {
        const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        const response = await axios.get(url);

        console.log("Backend - Stock data response:", response.data); // Debugging

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

module.exports = router;
