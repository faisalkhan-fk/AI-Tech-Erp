const fs = require('fs');
const path = require('path');

const basePath = "C:\\Users\\Faisal Khan\\.gemini\\antigravity-ide\\scratch\\ai-tech-erp\\frontend\\src";

const files = {
  "components/Sidebar.jsx": `import React from 'react';
import { Link } from 'react-router-dom';
export default function Sidebar() {
  return (
    <div className="w-64 bg-secondary text-white h-screen fixed">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">AI Tech ERP</div>
      <ul className="p-4 space-y-4">
        <li><Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link></li>
        <li><Link to="/employees" className="hover:text-blue-400 transition">Employees</Link></li>
      </ul>
    </div>
  );
}`,
  "components/Navbar.jsx": `import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-6 ml-64 sticky top-0 z-10">
      <div className="text-xl font-semibold text-gray-800">Welcome to AI Tech ERP</div>
      <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded shadow">Logout</button>
    </div>
  );
}`,
  "pages/Login.jsx": `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/signin', { username, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-xl w-96">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-primary">AI Tech ERP</h2>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>
        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">{error}</div>}
        <input className="w-full border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="w-full border border-gray-300 p-3 mb-6 rounded focus:outline-none focus:ring-2 focus:ring-primary" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="w-full bg-primary hover:bg-blue-800 transition text-white p-3 rounded font-bold shadow">Sign In</button>
      </form>
    </div>
  );
}`,
  "pages/Dashboard.jsx": `import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Overall Performance',
      data: [65, 59, 80, 81, 56, 95],
      backgroundColor: '#1d4ed8',
      borderRadius: 4
    }]
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary transform hover:-translate-y-1 transition duration-300">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Employees</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">120</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500 transform hover:-translate-y-1 transition duration-300">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Projects</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">15</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500 transform hover:-translate-y-1 transition duration-300">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Tasks</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">34</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-2/3">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Monthly Performance Metrics</h2>
          <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>
    </div>
  );
}`,
  "App.jsx": `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

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
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}
export default App;`,
  "main.jsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log("Frontend files generated successfully.");
