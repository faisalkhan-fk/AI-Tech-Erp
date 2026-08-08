import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [userRole, setUserRole] = useState('EMPLOYEE');
  const [userName, setUserName] = useState('');

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [employeesList, setEmployeesList] = useState([]);
  const [adminFormData, setAdminFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    checkIn: '',
    checkOut: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.username);
      const roles = user.roles || [];
      if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_MANAGER')) {
        setUserRole(roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'MANAGER');
        if (roles.includes('ROLE_ADMIN')) {
          fetchEmployeesList();
        }
      } else {
        setUserRole('EMPLOYEE');
      }
    }
    fetchAttendance();
  }, []);

  const fetchEmployeesList = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/employees', getAuthHeader());
      setEmployeesList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.accessToken || user?.token;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/attendance', getAuthHeader());
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminMark = async (e) => {
    e.preventDefault();
    try {
      let payload = { ...adminFormData };
      if (!payload.checkIn) delete payload.checkIn;
      if (!payload.checkOut) delete payload.checkOut;
      await axios.post('http://localhost:8081/api/attendance/admin/mark', payload, getAuthHeader());
      setShowAdminModal(false);
      fetchAttendance();
      alert('Attendance record updated successfully');
    } catch (err) {
      alert(err.response?.data || 'Failed to update attendance');
    }
  };

  const handleCheckIn = async () => {
    try {
      await axios.post('http://localhost:8081/api/attendance/checkin', {}, getAuthHeader());
      fetchAttendance();
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data);
      } else {
        console.error("Check-in failed", err);
      }
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await axios.post(`http://localhost:8081/api/attendance/checkout/${id}`, {}, getAuthHeader());
      fetchAttendance();
    } catch (err) {
      console.error("Check-out failed", err);
    }
  };

  const formatHours = (decimalHours) => {
    if (!decimalHours) return '-';
    const h = Math.floor(decimalHours);
    const m = Math.round((decimalHours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatEmpId = (id) => {
    return id ? `EMP${String(id).padStart(3, '0')}` : 'N/A';
  };

  const isAdminOrManager = userRole === 'ADMIN' || userRole === 'MANAGER';

  const filteredAttendance = attendance.filter(att => {
    let matchSearch = true;
    let matchDate = true;
    if (isAdminOrManager && searchQuery) {
      const name = att.employee ? `${att.employee.firstName} ${att.employee.lastName}`.toLowerCase() : '';
      const empIdStr = att.employee ? formatEmpId(att.employee.id).toLowerCase() : '';
      const q = searchQuery.toLowerCase();
      matchSearch = name.includes(q) || empIdStr.includes(q);
    }
    if (filterDate) {
      matchDate = att.date === filterDate;
    }
    return matchSearch && matchDate;
  });

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Attendance Tracking {(!isAdminOrManager && userName) ? `- ${userName}` : ''}
              </h1>
            </div>
            <div className="flex space-x-3">
              {userRole === 'ADMIN' && (
                <button onClick={() => setShowAdminModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow transition font-semibold">
                  📝 Manage Attendance
                </button>
              )}
              <button onClick={handleCheckIn} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition font-semibold">
                Check In
              </button>
            </div>
          </div>

          {showAdminModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl font-bold mb-4">Mark Attendance Manually</h2>
                <form onSubmit={handleAdminMark}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Employee</label>
                  <select className="w-full border p-2 mb-3 rounded text-sm" value={adminFormData.employeeId} onChange={e => setAdminFormData({...adminFormData, employeeId: e.target.value})} required>
                    <option value="">Select Employee</option>
                    {employeesList.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} (EMP{String(emp.id).padStart(3, '0')})</option>
                    ))}
                  </select>
                  
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Date</label>
                  <input type="date" className="w-full border p-2 mb-3 rounded text-sm" value={adminFormData.date} onChange={e => setAdminFormData({...adminFormData, date: e.target.value})} required />
                  
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Status</label>
                  <select className="w-full border p-2 mb-3 rounded text-sm" value={adminFormData.status} onChange={e => setAdminFormData({...adminFormData, status: e.target.value})} required>
                    <option value="PRESENT">PRESENT</option>
                    <option value="ABSENT">ABSENT</option>
                  </select>

                  <label className="text-xs font-semibold text-gray-600 block mb-1">Check In Time (HH:mm)</label>
                  <input type="time" className="w-full border p-2 mb-3 rounded text-sm" value={adminFormData.checkIn} onChange={e => setAdminFormData({...adminFormData, checkIn: e.target.value})} />
                  
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Check Out Time (HH:mm)</label>
                  <input type="time" className="w-full border p-2 mb-4 rounded text-sm" value={adminFormData.checkOut} onChange={e => setAdminFormData({...adminFormData, checkOut: e.target.value})} />
                  
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowAdminModal(false)} className="px-4 py-2 border rounded text-sm">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white text-sm rounded font-bold hover:bg-purple-700">Save Record</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isAdminOrManager && (
            <div className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <input 
                type="text" 
                placeholder="Search by Employee Name or ID..." 
                className="border px-4 py-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <input 
                type="date" 
                className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              <button 
                onClick={() => { setSearchQuery(''); setFilterDate(''); }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              >
                Clear Filters
              </button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  {isAdminOrManager && <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Employee</th>}
                  {isAdminOrManager && <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Employee ID</th>}
                  {isAdminOrManager && <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Department</th>}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Check In</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Check Out</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Working Hours</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredAttendance.length > 0 ? filteredAttendance.map(att => (
                  <tr key={att.id} className="hover:bg-blue-50/50 transition">
                    {isAdminOrManager && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="font-semibold text-gray-900">
                            {att.employee ? `${att.employee.firstName} ${att.employee.lastName}` : 'Unknown'}
                          </div>
                        </div>
                      </td>
                    )}
                    {isAdminOrManager && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {att.employee ? formatEmpId(att.employee.id) : '-'}
                      </td>
                    )}
                    {isAdminOrManager && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {att.employee?.department?.name || 'N/A'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{att.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{att.checkIn ? att.checkIn.substring(0, 5) : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{att.checkOut ? att.checkOut.substring(0, 5) : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">{formatHours(att.workingHours)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${att.status === 'PRESENT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {att.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!att.checkOut ? (
                        <button onClick={() => handleCheckOut(att.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded-full font-bold shadow transition">
                          Check Out
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-semibold bg-gray-100 px-3 py-1 rounded-full">Completed</span>
                      )}
                    </td>
                  </tr>
                )) : <tr><td colSpan={isAdminOrManager ? "9" : "6"} className="px-6 py-12 text-center text-gray-400 font-medium">No attendance records found. Try adjusting filters or Checking In.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}