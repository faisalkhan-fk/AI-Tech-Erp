import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const getActive = (path) => location.pathname === path ? "bg-gray-800 text-primary border-l-4 border-primary font-bold" : "hover:text-primary";
  
  return (
    <div className="w-64 bg-secondary text-white h-screen fixed shadow-lg overflow-y-auto pb-6">
      <div className="p-6 text-2xl font-black border-b border-gray-700 tracking-wider flex items-center gap-2">
        <span>🤖</span> AI Tech ERP
      </div>
      <ul className="mt-4 flex flex-col space-y-1">
        <li><Link to="/dashboard" className={`block py-3 px-6 transition ${getActive('/dashboard')}`}>📊 Dashboard</Link></li>
        <li><Link to="/employees" className={`block py-3 px-6 transition ${getActive('/employees')}`}>👥 Employees</Link></li>
        <li><Link to="/departments" className={`block py-3 px-6 transition ${getActive('/departments')}`}>🏢 Departments</Link></li>
        <li><Link to="/attendance" className={`block py-3 px-6 transition ${getActive('/attendance')}`}>⏱️ Attendance</Link></li>
        <li><Link to="/projects" className={`block py-3 px-6 transition ${getActive('/projects')}`}>📁 Projects</Link></li>
        <li><Link to="/tasks" className={`block py-3 px-6 transition ${getActive('/tasks')}`}>📋 Tasks</Link></li>
        <li><Link to="/leaves" className={`block py-3 px-6 transition ${getActive('/leaves')}`}>🏖️ Leaves</Link></li>
        <li><Link to="/ai" className={`block py-3 px-6 transition ${getActive('/ai')}`}>🧠 AI Workspace</Link></li>
        <li><Link to="/reports" className={`block py-3 px-6 transition ${getActive('/reports')}`}>📈 Reports & Export</Link></li>
      </ul>
    </div>
  );
}