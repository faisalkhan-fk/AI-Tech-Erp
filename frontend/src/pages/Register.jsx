import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [designation, setDesignation] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  useEffect(() => {
    // Fetch departments for the dropdown
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/departments`);
        setDepartments(res.data);
        if (res.data.length > 0) {
          setDepartmentId(res.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };
    fetchDepartments();
  }, [API_URL]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';

    const payload = {
      username,
      password,
      role: [role],
      firstName,
      lastName,
      email,
      phone
    };

    if (role === 'employee' || role === 'manager') {
      payload.designation = designation;
      if (departmentId) {
        payload.departmentId = parseInt(departmentId, 10);
      }
    }

    try {
      await axios.post(`${API_URL}/api/auth/signup`, payload);
      setSuccess('Account registered successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-primary">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-primary">AI Tech ERP</h2>
          <p className="text-gray-500 mt-1 text-sm">Create a new account</p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-xs font-semibold text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-xs font-semibold text-center">{success}</div>}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
            <input 
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
              placeholder="e.g. John Doe" 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Username</label>
              <input 
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
                placeholder="Choose a username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                minLength={3}
                required 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Phone Number</label>
              <input 
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
                placeholder="e.g. +91 9876543210" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address</label>
            <input 
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
              type="email"
              placeholder="e.g. john@aitech.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Password</label>
              <input 
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
                type="password" 
                placeholder="Min 6 chars" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                minLength={6}
                required 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Confirm Password</label>
              <input 
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
                type="password" 
                placeholder="Confirm password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                minLength={6}
                required 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Select Role</label>
            <select 
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {(role === 'employee' || role === 'manager') && (
            <div className="grid grid-cols-2 gap-4 bg-blue-50 p-3 rounded border border-blue-100">
              <div>
                <label className="text-xs font-semibold text-blue-800 block mb-1">Department</label>
                <select 
                  className="w-full border border-blue-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  value={departmentId}
                  onChange={e => setDepartmentId(e.target.value)}
                >
                  {departments.length === 0 && <option value="">Loading...</option>}
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-blue-800 block mb-1">Designation</label>
                <input 
                  className="w-full border border-blue-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" 
                  placeholder="e.g. Developer" 
                  value={designation} 
                  onChange={e => setDesignation(e.target.value)} 
                />
              </div>
            </div>
          )}
        </div>

        <button className="w-full bg-primary hover:bg-blue-800 transition text-white p-3 rounded font-bold shadow mt-6">
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
