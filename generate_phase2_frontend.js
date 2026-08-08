const fs = require('fs');
const path = require('path');

const basePath = "C:\\Users\\Faisal Khan\\.gemini\\antigravity-ide\\scratch\\ai-tech-erp\\frontend\\src";

const files = {
  "pages/Employees.jsx": `import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get('http://localhost:8080/api/employees', {
        headers: { Authorization: \`Bearer \${user.token}\` }
      });
      setEmployees(res.data);
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
            <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
            <button className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">Add Employee</button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.length > 0 ? employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{emp.firstName} {emp.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{emp.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{emp.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No employees found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}`,

  "pages/Attendance.jsx": `import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  
  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get('http://localhost:8080/api/attendance', {
        headers: { Authorization: \`Bearer \${user.token}\` }
      });
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = async () => {
     try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post('http://localhost:8080/api/attendance/checkin', { employee: { id: user.id } }, {
        headers: { Authorization: \`Bearer \${user.token}\` }
      });
      fetchAttendance();
    } catch (err) {
      console.error("Check-in failed", err);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Attendance Tracking</h1>
            <div>
                <button onClick={handleCheckIn} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition mr-2">Check In</button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition">Check Out</button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.length > 0 ? attendance.map(att => (
                  <tr key={att.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{att.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{att.checkIn}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{att.checkOut || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={\`px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${att.status === 'PRESENT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}\`}>
                            {att.status}
                        </span>
                    </td>
                  </tr>
                )) : <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No attendance records found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}`,

  "App.jsx": `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

function App() {
  const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
        <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}
export default App;`,

  "components/Sidebar.jsx": `import React from 'react';
import { Link, useLocation } from 'react-router-dom';
export default function Sidebar() {
  const location = useLocation();
  const getActive = (path) => location.pathname === path ? "bg-gray-800 text-primary border-l-4 border-primary" : "hover:text-primary";
  
  return (
    <div className="w-64 bg-secondary text-white h-screen fixed shadow-lg">
      <div className="p-6 text-2xl font-black border-b border-gray-700 tracking-wider">AI Tech ERP</div>
      <ul className="mt-4 flex flex-col space-y-2">
        <li><Link to="/dashboard" className={\`block py-3 px-6 transition \${getActive('/dashboard')}\`}>Dashboard</Link></li>
        <li><Link to="/employees" className={\`block py-3 px-6 transition \${getActive('/employees')}\`}>Employees</Link></li>
        <li><Link to="/attendance" className={\`block py-3 px-6 transition \${getActive('/attendance')}\`}>Attendance</Link></li>
      </ul>
    </div>
  );
}`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log("Phase 2 frontend files generated successfully.");
