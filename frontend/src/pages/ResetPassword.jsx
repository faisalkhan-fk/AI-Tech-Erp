import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otpVerified = location.state?.otpVerified;

  useEffect(() => {
    if (!email || !otpVerified) {
      navigate('/forgot-password');
    }
  }, [email, otpVerified, navigate]);

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;
    
    if (score === 0 && pass.length > 0) return { label: 'Very Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (score === 1) return { label: 'Weak', color: 'bg-orange-500', width: 'w-2/4' };
    if (score === 2) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-3/4' };
    if (score >= 3) return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
    return { label: '', color: 'bg-gray-200', width: 'w-0' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/auth/reset-password`, {
        email,
        newPassword,
        confirmPassword
      });
      setSuccess(res.data.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email || !otpVerified) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleResetPassword} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-primary">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-primary">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create a new strong password for your account.
          </p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-xs font-semibold text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-xs font-semibold text-center">{success}</div>}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">New Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm pr-10" 
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 chars, 1 uppercase, 1 symbol" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
                disabled={loading || success}
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-primary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {newPassword.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Password Strength</span>
                  <span className={`text-[10px] font-bold uppercase ${strength.color.replace('bg-', 'text-')}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className={`${strength.color} ${strength.width} h-1.5 rounded-full transition-all duration-300`}></div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Confirm New Password <span className="text-red-500">*</span></label>
            <input 
              className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your new password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
              disabled={loading || success}
            />
          </div>
        </div>

        <button 
          disabled={loading || success || newPassword.length < 8}
          className={`w-full text-white p-3 rounded font-bold shadow mt-6 transition ${
            loading || success || newPassword.length < 8 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-800'
          }`}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
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
