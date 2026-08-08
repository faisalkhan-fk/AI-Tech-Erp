const fs = require('fs');
const path = require('path');

const basePath = "C:\\Users\\Faisal Khan\\.gemini\\antigravity-ide\\scratch\\ai-tech-erp\\frontend\\src";

const files = {
  "pages/AI.jsx": `import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function AI() {
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [report, setReport] = useState('');

  const generateReport = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get('http://localhost:8080/api/ai/report', {
        headers: { Authorization: \`Bearer \${user.token}\` }
      });
      setReport(res.data.report);
    } catch (err) { console.error(err); }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.post('http://localhost:8080/api/ai/chat', { query: chatQuery }, {
        headers: { Authorization: \`Bearer \${user.token}\` }
      });
      setChatResponse(res.data.response);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Workspace</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow border-t-4 border-purple-500">
              <h2 className="text-xl font-bold mb-4">AI Daily Report Generator</h2>
              <button onClick={generateReport} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow transition mb-4">Generate End-of-Day Report</button>
              {report && (
                <div className="bg-purple-50 p-4 rounded text-purple-900 italic">
                  "\${report}"
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
              <h2 className="text-xl font-bold mb-4">AI HR Assistant</h2>
              <form onSubmit={handleChat} className="mb-4 flex">
                <input type="text" className="flex-1 border border-gray-300 p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ask about policies, leaves, etc..." value={chatQuery} onChange={e => setChatQuery(e.target.value)} required />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition">Ask AI</button>
              </form>
              {chatResponse && (
                <div className="bg-blue-50 p-4 rounded text-blue-900 font-medium">
                  🤖 {chatResponse}
                </div>
              )}
            </div>
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
import AI from './pages/AI';

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
        <Route path="/ai" element={<PrivateRoute><AI /></PrivateRoute>} />
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
        <li><Link to="/ai" className={\`block py-3 px-6 transition \${getActive('/ai')}\`}>AI Workspace</Link></li>
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
console.log("Phase 4 AI frontend files generated successfully.");
