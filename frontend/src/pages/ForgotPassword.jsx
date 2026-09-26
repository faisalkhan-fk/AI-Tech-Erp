import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/auth/forgot-password`, {
        email
      });
      setSuccess('If an account exists with this email, an OTP has been sent.');
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request OTP. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSendOtp} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-primary">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-primary">AI Tech ERP</h2>
          <p className="mt-2 text-sm font-semibold text-gray-700">Forgot Password</p>
        </div>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter the email associated with your AI Tech ERP account.
        </p>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-xs font-semibold text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-xs font-semibold text-center">{success}</div>}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Registered Email <span className="text-red-500">*</span></label>
            <input 
              className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
              type="email"
              placeholder="e.g. john@aitech.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              disabled={loading || success}
            />
          </div>
        </div>

        <button 
          disabled={loading || success}
          className={`w-full text-white p-3 rounded font-bold shadow mt-6 transition ${
            loading || success ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-800'
          }`}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>

        <div className="text-center mt-6 text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
