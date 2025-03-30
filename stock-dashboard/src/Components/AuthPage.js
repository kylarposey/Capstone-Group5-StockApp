import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db, doc, getDoc, setDoc, signInWithPopup } from "../firebase";
import "../assets/css/AuthPage.css"; // Import the CSS file for styling
import secImage from "../assets/css/buildings.png"; // Import the background image
import stonksImage from "../assets/css/stonks.jpg"; // Import the stonks image

function AuthPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user document exists in Firestore
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      
      // If user doesn't exist in Firestore, create their document
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          createdAt: new Date(),
        }, { merge: true });
        console.log("New user registered:", user.email);
      } else {
        console.log("Existing user signed in:", user.email);
      }
      
      navigate("/");
    } catch (error) {
      console.error("Error during authentication:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div
      className="auth-container"
      style={{
        backgroundImage: `url(${secImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="auth-content d-flex bg-white p-4 rounded shadow" style={{ width: "60rem" }}>
        {/* Left Section with Image */}
        <div className="left-section d-flex align-items-center justify-content-center">
          <img src={stonksImage} alt="Stonks" className="stonks-image" />
        </div>

        {/* Center Section with Google Auth */}
        <div className="center-section text-center mx-4">
          <h2 className="h4 mb-4">Login/Register using your Google account</h2>
          <button
            id="google-auth-button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="d-flex align-items-center justify-content-center w-100 p-3 bg-white border border-secondary rounded shadow-sm hover-shadow-sm disabled-opacity-50"
          >
            <img
              className="google-logo"
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
            />
            {isLoading ? "Processing..." : "Continue with Google"}
          </button>
        </div>

        {/* Right Section with Bullet Points */}
        <div className="right-section">
          <h3>Why Make an Account?</h3>
          <ul>
            <li>Track your portfolio with ease</li>
            <li>Get real-time stock updates</li>
            <li>Learn about investing in the stock market</li>
            <li>Stay informed with curated news</li>
          </ul>
        </div>
      </div>
    </div>
  );

  /* return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
        <h2 className="text-2xl font-semibold mb-4">Continue with Google</h2>
        <button 
          onClick={handleGoogleAuth} 
          disabled={isLoading}
          className="flex items-center justify-center w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition disabled:opacity-50"
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" 
               alt="Google Logo" 
               className="w-6 h-6 mr-3"
          />
          {isLoading ? "Processing..." : "Continue with Google"}
        </button>
      </div> 
    </div>
  );
 */
  /* return (
    <div className="card-container">
      <h2>Welcome to the App</h2>
      <button 
        onClick={handleGoogleAuth} 
        disabled={isLoading}
        className="google-auth-button"
      >
        {isLoading ? "Processing..." : "Continue with Google"}
      </button>
    </div>
  ); */
}

export default AuthPage;