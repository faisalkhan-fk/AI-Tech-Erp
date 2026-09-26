import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [resendCooldown, setResendCooldown] = useState(60); // 60 seconds
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('OTP must be exactly 6 digits.');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/auth/verify-otp`, {
        email,
        otp
      });
      setSuccess('OTP verified successfully!');
      setTimeout(() => {
        navigate('/reset-password', { state: { email, otpVerified: true } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/auth/forgot-password`, {
        email
      });
      setSuccess('A new OTP has been sent to your email.');
      setResendCooldown(60);
      setTimeLeft(300); // Reset expiry timer
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleVerifyOtp} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-primary">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-primary">Verify OTP</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to <br/><span className="font-semibold text-gray-800">{email}</span>
          </p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-xs font-semibold text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-xs font-semibold text-center">{success}</div>}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">OTP <span className="text-red-500">*</span></label>
            <input 
              className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-primary text-center text-xl tracking-[0.5em] font-mono" 
              type="text"
              maxLength="6"
              placeholder="••••••" 
              value={otp} 
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
              required 
              disabled={loading || success || timeLeft === 0}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3 text-xs font-semibold">
          <span className={timeLeft === 0 ? 'text-red-500' : 'text-gray-500'}>
            Expires in: {formatTime(timeLeft)}
          </span>
          
          <button 
            type="button"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || loading}
            className={`${resendCooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:underline'}`}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
          </button>
        </div>

        <button 
          disabled={loading || success || timeLeft === 0 || otp.length !== 6}
          className={`w-full text-white p-3 rounded font-bold shadow mt-6 transition ${
            loading || success || timeLeft === 0 || otp.length !== 6 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-800'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="text-center mt-6 text-sm text-gray-600">
          <Link to="/login" className="text-primary font-bold hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
