import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../assets/css/style.css"; 

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/"); // Redirect to home after login
        } catch (error) {
            setError("Invalid email or password.");
            console.error("Login Error:", error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login to Your Account</h2>
            <form onSubmit={handleLogin} className="auth-form">
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error-text">{error}</p>}
        </div>
    );
}

export default LoginPage;
