import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
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
                navigate("/login");
            }
        });
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [field]: checked
                ? [...prevData[field], value]
                : prevData[field].filter((item) => item !== value),
        }));
    };

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
                await setDoc(userRef, { portfolio: formData }, { merge: true });
    
                const response = await fetch("https://capstone-group5-stockapp.onrender.com/api/generatePortfolio", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.uid, preferences: formData }),
                    mode: "cors",
                });
    
                const generatedPortfolio = await response.json();
                console.log("✅ Portfolio Generated:", generatedPortfolio);
    
                await setDoc(userRef, { generatedPortfolio }, { merge: true });
    
                console.log("✅ Final Stored Portfolio:", generatedPortfolio);
    
                navigate("/");
            } else {
                console.error("User document not found.");
            }
        } catch (error) {
            console.error("🔥 Error saving portfolio:", error);
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
                        <option value="Balanced stocks & ETFs">Balanced stocks & ETFs</option>
                        <option value="Conservative (more ETFs, fewer stocks)">Conservative (more ETFs, fewer stocks)</option>
                    </select>
                </div>

                {/* Market Reaction */}
                <div className="question-group">
                    <label className="question-label">How do you react when the market drops significantly?</label>
                    <select name="marketReaction" className="input-field" onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="Buy more">I buy more (buy the dip)</option>
                        <option value="Hold">I hold and wait it out</option>
                        <option value="Nervous">I get nervous and consider selling</option>
                        <option value="Sell quickly">I sell quickly to protect my capital</option>
                    </select>
                </div>

                {/* Investment Involvement */}
                <div className="question-group">
                    <label className="question-label">How involved do you want to be in managing your investments?</label>
                    <select name="investmentInvolvement" className="input-field" onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="Hands-off">I prefer a hands-off approach (set and forget)</option>
                        <option value="Monitor">I like to monitor and adjust occasionally</option>
                        <option value="Active">I actively research and trade frequently</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button type="submit" className="generate-btn">Generate Portfolio</button>
            </form>
        </div>
    );
}

export default PortfolioCreation;
