import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Import Firestore and Auth
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../assets/css/portfolioCreation.css";

function PortfolioCreation() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        riskTolerance: "",
        investmentTypes: [],
        excludeIndustries: [],
        investmentGoal: "",
        portfolioMix: "",
        fundPreference: "",
        stockSize: "",
    });

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate("/login"); // Redirect if not logged in
            }
        });
    }, [navigate]);

    // Handle Select Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Checkbox Changes
    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [field]: checked
                ? [...prevData[field], value]
                : prevData[field].filter((item) => item !== value),
        }));
    };

    // 🔹 Save Portfolio to Firestore (Overwrites old portfolio)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            console.error("No user is logged in.");
            return;
        }
    
        try {
            const userRef = doc(db, "Users", user.uid);
            const userDoc = await getDoc(userRef);
    
            if (userDoc.exists()) {
                // Save preferences first
                await setDoc(userRef, { portfolio: formData }, { merge: true });
    
                // Call backend to generate categorized portfolio
                const response = await fetch("https://capstone-group5-stockapp.onrender.com/api/generatePortfolio", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.uid, preferences: formData }),
                });
    
                const generatedPortfolio = await response.json();
    
                // Ensure it correctly updates in Firestore
                await setDoc(userRef, { generatedPortfolio }, { merge: true });
    
                console.log("Portfolio saved successfully with correct categorization!");
            } else {
                console.error("User document not found.");
            }
    
            navigate("/");
        } catch (error) {
            console.error("Error saving portfolio:", error);
        }
    };
    
    
    
    
    

    return (
        <div className="portfolio-container">
            <h2 className="portfolio-title">Create Your Investment Portfolio</h2>
            <form onSubmit={handleSubmit}>
                {/* Risk Tolerance */}
                <div className="question-group">
                    <label className="question-label">How would you describe your risk tolerance?</label>
                    <select name="riskTolerance" className="input-field" onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="Conservative">Conservative</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Aggressive">Aggressive</option>
                    </select>
                </div>

                {/* Investment Interests */}
                <div className="question-group">
                    <label className="question-label">What type of investments interest you the most?</label>
                    <div className="checkbox-group">
                        {["Growth stocks", "Dividend stocks", "ETFs", "Cryptocurrencies", "REITs"].map((type) => (
                            <label key={type}>
                                <input type="checkbox" value={type} onChange={(e) => handleCheckboxChange(e, "investmentTypes")} />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Excluded Industries */}
                <div className="question-group">
                    <label className="question-label">Would you like to exclude any industries?</label>
                    <div className="checkbox-group">
                        {["Oil & Gas", "Tobacco & Alcohol", "Weapons & Defense", "Gambling & Casinos", "Crypto & Blockchain"].map((industry) => (
                            <label key={industry}>
                                <input type="checkbox" value={industry} onChange={(e) => handleCheckboxChange(e, "excludeIndustries")} />
                                {industry}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Investment Goal */}
                <div className="question-group">
                    <label className="question-label">What is your investment goal?</label>
                    <select name="investmentGoal" className="input-field" onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="Short-term (1-3 years)">Short-term (1-3 years)</option>
                        <option value="Medium-term (3-10 years)">Medium-term (3-10 years)</option>
                        <option value="Long-term (10+ years)">Long-term (10+ years)</option>
                    </select>
                </div>

                {/* Portfolio Mix */}
                <div className="question-group">
                    <label className="question-label">What is your ideal portfolio mix?</label>
                    <select name="portfolioMix" className="input-field" onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="Mostly stocks">Mostly stocks</option>
                        <option value="Balanced stocks & bonds">Balanced stocks & bonds</option>
                        <option value="Conservative (more bonds, fewer stocks)">Conservative (more bonds, fewer stocks)</option>
                    </select>
                </div>

                {/* Fund Type */}
                <div className="question-group">
                    <label className="question-label">Do you prefer actively managed or passive index funds?</label>
                    <select name="fundPreference" className="input-field" onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="Actively Managed">Actively Managed</option>
                        <option value="Passive Index Funds">Passive Index Funds</option>
                    </select>
                </div>

                {/* Stock Size */}
                <div className="question-group">
                    <label className="question-label">What size stocks do you prefer?</label>
                    <select name="stockSize" className="input-field" onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="Large-cap">Large-cap (Stable, well-established companies)</option>
                        <option value="Mid-cap">Mid-cap (Growing companies)</option>
                        <option value="Small-cap">Small-cap (High risk, high reward)</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button type="submit" className="generate-btn">Generate Portfolio</button>
            </form>
        </div>
    );
}

export default PortfolioCreation;
