import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db, doc, getDoc, setDoc, signInWithPopup } from "../firebase";

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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="bg-white p-4 rounded shadow text-center" style={{ width: '30rem' }}>
        <h2 className="h4 mb-4">Signup or SignIn with Google</h2>
        <button
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