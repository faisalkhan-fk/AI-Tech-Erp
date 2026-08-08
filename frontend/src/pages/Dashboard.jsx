import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    activeProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    attendanceCount: 0
  });

  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.accessToken || user?.token;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const header = getAuthHeader();
      const [empRes, projRes, taskRes, attRes] = await Promise.allSettled([
        axios.get('http://localhost:8081/api/employees', header),
        axios.get('http://localhost:8081/api/projects', header),
        axios.get('http://localhost:8081/api/tasks', header),
        axios.get('http://localhost:8081/api/attendance', header)
      ]);

      const employees = empRes.status === 'fulfilled' && Array.isArray(empRes.value.data) ? empRes.value.data : [];
      const projects = projRes.status === 'fulfilled' && Array.isArray(projRes.value.data) ? projRes.value.data : [];
      const tasks = taskRes.status === 'fulfilled' && Array.isArray(taskRes.value.data) ? taskRes.value.data : [];
      const attendance = attRes.status === 'fulfilled' && Array.isArray(attRes.value.data) ? attRes.value.data : [];

      setMetrics({
        totalEmployees: employees.length,
        activeProjects: projects.filter(p => p.status !== 'COMPLETED').length,
        pendingTasks: tasks.filter(t => t.status === 'PENDING' || !t.status || t.status === 'TODO').length,
        completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
        attendanceCount: attendance.length
      });
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    }
  };

  const chartData = {
    labels: ['Employees', 'Active Projects', 'Pending Tasks', 'Completed Tasks', 'Attendance Logs'],
    datasets: [{
      label: 'Live Count',
      data: [
        metrics.totalEmployees,
        metrics.activeProjects,
        metrics.pendingTasks,
        metrics.completedTasks,
        metrics.attendanceCount
      ],
      backgroundColor: ['#1e3a8a', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'],
      borderRadius: 6
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <button 
            onClick={fetchDashboardData}
            className="bg-white border text-gray-700 px-3 py-1.5 rounded shadow-sm text-sm hover:bg-gray-100 font-semibold flex items-center gap-1"
          >
            🔄 Refresh Metrics
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary transform hover:-translate-y-1 transition duration-300">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Employees</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">{metrics.totalEmployees}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500 transform hover:-translate-y-1 transition duration-300">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Projects</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">{metrics.activeProjects}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500 transform hover:-translate-y-1 transition duration-300">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Tasks</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">{metrics.pendingTasks}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-2/3">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Real-time Performance & Activity Metrics</h2>
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );
}