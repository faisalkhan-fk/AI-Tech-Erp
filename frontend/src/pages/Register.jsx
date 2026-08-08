import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`\${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/auth/signup`, {
        username,
        password,
        role: [role]
      });
      setSuccess('Account registered successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-xl w-96 border-t-4 border-primary">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-primary">AI Tech ERP</h2>
          <p className="text-gray-500 mt-1 text-sm">Create a new account</p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-xs text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-xs text-center">{success}</div>}

        <label className="text-xs font-semibold text-gray-600 block mb-1">Username</label>
        <input 
          className="w-full border border-gray-300 p-2.5 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-primary" 
          placeholder="Choose a username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          minLength={3}
          required 
        />

        <label className="text-xs font-semibold text-gray-600 block mb-1">Password</label>
        <input 
          className="w-full border border-gray-300 p-2.5 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-primary" 
          type="password" 
          placeholder="Choose a password (min 6 chars)" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          minLength={6}
          required 
        />

        <label className="text-xs font-semibold text-gray-600 block mb-1">Select Role</label>
        <select 
          className="w-full border border-gray-300 p-2.5 mb-5 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        <button className="w-full bg-primary hover:bg-blue-800 transition text-white p-3 rounded font-bold shadow">
          Sign Up
        </button>

        <div className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
