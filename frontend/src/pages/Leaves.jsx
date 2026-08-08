import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ type: 'CASUAL', startDate: '', endDate: '', reason: '' });
  const [balance, setBalance] = useState(null);
  const [userRole, setUserRole] = useState('');

  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.accessToken || user?.token;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => { fetchUserInfo(); fetchLeaves(); }, []);

  const fetchUserInfo = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const roles = user.roles || [];
      if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_MANAGER')) {
        setUserRole(roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'MANAGER');
      } else {
        setUserRole('EMPLOYEE');
      }
      // fetch balance for employee
      fetchBalance(user.id);
    }
  };

  const fetchBalance = async (employeeId) => {
    try {
      const res = await axios.get(`\${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/leaves/balance/${employeeId}`, getAuthHeader());
      setBalance(res.data);
    } catch (err) {
      console.error('Balance fetch error', err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`\${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/leaves`, getAuthHeader());
      setLeaves(res.data);
    } catch (err) { console.error(err); }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`\${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/leaves`, formData, getAuthHeader());
      setShowModal(false);
      setFormData({ type: 'CASUAL', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`\${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/leaves/${id}/approve`, {}, getAuthHeader());
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`\${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/leaves/${id}/reject`, {}, getAuthHeader());
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
            <div className="flex items-center gap-4">
              {balance !== null && (
                <div className="text-lg text-gray-700">
                  <span className="font-medium">Leave Balance:</span> {balance} days
                </div>
              )}
              <button onClick={() => setShowModal(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow transition font-semibold">
                + Apply Leave
              </button>
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Apply for Leave</h2>
                <form onSubmit={handleApplyLeave}>
                  <select className="w-full border p-2 mb-3 rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="CASUAL">Casual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="ANNUAL">Annual Leave</option>
                  </select>
                  <label className="text-xs text-gray-500 font-semibold block mb-1">Start Date</label>
                  <input className="w-full border p-2 mb-3 rounded" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                  <label className="text-xs text-gray-500 font-semibold block mb-1">End Date</label>
                  <input className="w-full border p-2 mb-3 rounded" type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                  <textarea className="w-full border p-2 mb-4 rounded" placeholder="Reason" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} required />
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded font-bold hover:bg-yellow-600">Submit Application</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  {userRole === 'ADMIN' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.length > 0 ? leaves.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{l.type}</td>
                    <td className="px-6 py-4 text-gray-600">{l.startDate}</td>
                    <td className="px-6 py-4 text-gray-600">{l.endDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${l.status === 'APPROVED' ? 'bg-green-100 text-green-800' : l.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {l.status}
                      </span>
                    </td>
                    {userRole === 'ADMIN' && (
                      <td className="px-6 py-4 space-x-2">
                        {l.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleApprove(l.id)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">Approve</button>
                            <button onClick={() => handleReject(l.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Reject</button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                )) : <tr><td colSpan={userRole === 'ADMIN' ? '5' : '4'} className="px-6 py-4 text-center text-gray-500">No leave requests found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}