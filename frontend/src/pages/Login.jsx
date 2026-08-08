import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/auth/signin`, { username, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && typeof err.response.data === 'string') {
        setError(err.response.data);
      } else {
        setError('Login failed. Please check credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 border-t-4 border-primary">
        <form onSubmit={handleLogin}>
          <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold text-primary">AI Tech ERP</h2>
              <p className="text-gray-500 mt-1 text-sm">Sign in to your account</p>
          </div>
          {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-xs text-center">{error}</div>}
          
          <label className="text-xs font-semibold text-gray-600 block mb-1">Username</label>
          <input className="w-full border border-gray-300 p-2.5 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-600">Password</label>
            <Link to="/forgot-password" className="text-xs text-primary font-bold hover:underline">Forgot Password?</Link>
          </div>
          <input className="w-full border border-gray-300 p-2.5 mb-5 rounded focus:outline-none focus:ring-2 focus:ring-primary" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          
          <button className="w-full bg-primary hover:bg-blue-800 transition text-white p-3 rounded font-bold shadow mb-4">
            Sign In
          </button>
        </form>

        <div className="border-t pt-4 text-center">
          <p className="text-xs text-gray-500 mb-2">New to AI Tech ERP?</p>
          <Link to="/register" className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded transition shadow-sm">
            ➕ Create New Account (Sign Up)
          </Link>
        </div>
      </div>
    </div>
  );
}