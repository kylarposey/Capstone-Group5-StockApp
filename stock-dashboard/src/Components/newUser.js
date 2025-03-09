import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db, doc, setDoc, signInWithPopup } from "../firebase";

function NewUser() {
  const navigate = useNavigate();

  const registerWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Store user data in Firestore
      const userRef = doc(db, "Users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        createdAt: new Date(),
      }, { merge: true });

      console.log("User registered:", user);

      // Redirect user to Login Page after successful registration
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="new-user-container">
      <h2>Sign Up for an Account</h2>
      <button onClick={registerWithGoogle}>Sign Up with Google</button>
    </div>
  );
}

export default NewUser;
