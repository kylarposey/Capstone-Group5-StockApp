import React, { useState } from 'react';
import "../assets/css/newUser.css";

function NewUser() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one symbol (!@#$%^&*).');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    // Handle form submission logic here
    console.log('Form submitted');
  };

  return (
    <div className="new-user-container">
      <form onSubmit={handleSubmit}>
        <h2>Create a New Account</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          pattern="[A-Za-z]+"
          title="First name should contain letters only."
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          pattern="[A-Za-z]+"
          title="Last name should contain letters only."
          required
        />
        <div>
          <select value={month} onChange={(e) => setMonth(e.target.value)} required>
            <option value="">Month</option>
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, index) => (
              <option key={index} value={m}>{m}</option>
            ))}
          </select>
          <select value={day} onChange={(e) => setDay(e.target.value)} required>
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            pattern="\d{4}"
            title="Year should be a 4-digit number."
            required
          />
        </div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default NewUser;