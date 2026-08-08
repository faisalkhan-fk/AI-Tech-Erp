const fs = require('fs');
const path = require('path');

const basePath = "C:\\Users\\Faisal Khan\\.gemini\\antigravity-ide\\scratch\\ai-tech-erp\\frontend\\src";

const files = {
  "pages/Projects.jsx": `import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get('http://localhost:8080/api/projects', {
        headers: { Authorization: \`Bearer \${user.token}\` }
      });
      setProjects(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
            <button className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">Create Project</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? projects.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
                <h2 className="text-xl font-bold mb-2">{p.name}</h2>
                <p className="text-gray-600 mb-4">{p.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Status: {p.status}</span>
                  <span>End: {p.endDate}</span>
                </div>
              </div>
            )) : <p className="text-gray-500">No projects found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}`,

  "pages/Tasks.jsx": `import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get('http://localhost:8080/api/tasks', {
        headers: { Authorization: \`Bearer \${user.token}\` }
      });
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Tasks Board</h1>
            <button className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">New Task</button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.length > 0 ? tasks.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{t.title}</td>
                    <td className="px-6 py-4">{t.priority}</td>
                    <td className="px-6 py-4">{t.dueDate}</td>
                    <td className="px-6 py-4">{t.status}</td>
                  </tr>
                )) : <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No tasks found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}`,

  "pages/Leaves.jsx": `import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get('http://localhost:8080/api/leaves', {
        headers: { Authorization: \`Bearer \${user.token}\` }
      });
      setLeaves(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow transition">Apply Leave</button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.length > 0 ? leaves.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{l.type}</td>
                    <td className="px-6 py-4">{l.startDate}</td>
                    <td className="px-6 py-4">{l.endDate}</td>
                    <td className="px-6 py-4">
                        <span className={\`px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${l.status === 'APPROVED' ? 'bg-green-100 text-green-800' : l.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}\`}>
                            {l.status}
                        </span>
                    </td>
                  </tr>
                )) : <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No leave requests found</td></tr>}
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
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Leaves from './pages/Leaves';

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
        <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
        <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
        <Route path="/leaves" element={<PrivateRoute><Leaves /></PrivateRoute>} />
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
    <div className="w-64 bg-secondary text-white h-screen fixed shadow-lg overflow-y-auto pb-6">
      <div className="p-6 text-2xl font-black border-b border-gray-700 tracking-wider">AI Tech ERP</div>
      <ul className="mt-4 flex flex-col space-y-2">
        <li><Link to="/dashboard" className={\`block py-3 px-6 transition \${getActive('/dashboard')}\`}>Dashboard</Link></li>
        <li><Link to="/employees" className={\`block py-3 px-6 transition \${getActive('/employees')}\`}>Employees</Link></li>
        <li><Link to="/attendance" className={\`block py-3 px-6 transition \${getActive('/attendance')}\`}>Attendance</Link></li>
        <li><Link to="/projects" className={\`block py-3 px-6 transition \${getActive('/projects')}\`}>Projects</Link></li>
        <li><Link to="/tasks" className={\`block py-3 px-6 transition \${getActive('/tasks')}\`}>Tasks</Link></li>
        <li><Link to="/leaves" className={\`block py-3 px-6 transition \${getActive('/leaves')}\`}>Leaves</Link></li>
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
console.log("Phase 3 frontend files generated successfully.");
