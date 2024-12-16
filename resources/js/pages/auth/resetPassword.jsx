import React, { useState } from 'react';
import axios from 'axios';
import backgroundImage from "../../../img/bg-2.jpg"; // Replace with the correct path to your background image

export function ResetPassword() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/reset-password', {
        token,
        password,
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error resetting password');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#333333',
              fontFamily: 'Poppins'
            }}
          >
            Set New Password
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', fontFamily: 'Poppins' }}>
            Set your password for log in.
          </p>
        </div>
        {message && (
          <p style={{ textAlign: 'center', color: 'red', marginBottom: '1rem' }}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Hidden Email Field */}
          <input type="hidden" value={token} onChange={() => { }} />

          <div>
            <label
              htmlFor="new-password"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#4B5563',
                marginBottom: '0.5rem',
                fontFamily: 'Poppins'
              }}
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                border: '1px solid #d1d5db',
                borderRadius: '50px',
                padding: '20px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#4B5563',
                marginBottom: '0.5rem',
                fontFamily: 'Poppins'
              }}
            >
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              style={{
                width: '100%',
                border: '1px solid #d1d5db',
                borderRadius: '50px',
                padding: '20px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#fc8c11',
              color: '#ffffff',
              borderRadius: '50px',
              padding: '20px',
              border: 'none',
              fontWeight: '500',
              textAlign: 'center',
              cursor: 'pointer',
              fontFamily: 'Poppins'
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#e55307')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f97316')}
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
