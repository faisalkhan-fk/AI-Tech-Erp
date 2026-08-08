import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/auth/forgot-password`, { username });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/reset-password', { state: { username } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 border-t-4 border-yellow-500">
        <form onSubmit={handleForgot}>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-primary">AI Tech ERP</h2>
            <p className="text-gray-500 mt-1 text-sm">Forgot Password</p>
          </div>

          {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-xs text-center">{error}</div>}
          {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-xs text-center">{message}</div>}

          <label className="text-xs font-semibold text-gray-600 block mb-1">Enter your Username</label>
          <input 
            className="w-full border border-gray-300 p-2.5 mb-5 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500" 
            placeholder="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />

          <button className="w-full bg-yellow-500 hover:bg-yellow-600 transition text-white p-3 rounded font-bold shadow mb-4">
            Verify Username
          </button>
        </form>

        <div className="border-t pt-4 text-center">
          <Link to="/login" className="text-sm text-primary font-bold hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
