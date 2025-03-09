import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithPopup } from "../firebase";

function LoginPage() {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("User signed in successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default LoginPage;
