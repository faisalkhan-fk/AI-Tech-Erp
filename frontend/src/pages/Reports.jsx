import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Reports() {
  const [downloadMsg, setDownloadMsg] = useState('');

  const handleExport = (type, format) => {
    setDownloadMsg(`Downloading ${type} report in ${format} format...`);
    setTimeout(() => {
      setDownloadMsg(`Successfully exported ${type} report!`);
      setTimeout(() => setDownloadMsg(''), 3000);
    }, 1500);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports & Analytics Center</h1>

          {downloadMsg && (
            <div className="bg-blue-100 border-l-4 border-blue-600 text-blue-800 p-4 rounded mb-6 text-sm font-semibold">
              ℹ️ {downloadMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Attendance Report Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Monthly Attendance Report</h3>
              <p className="text-gray-600 text-sm mb-4">Complete logs of check-in/out times, working hours, and present/absent counts.</p>
              <div className="flex space-x-2">
                <button onClick={() => handleExport('Attendance', 'PDF')} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded">
                  📄 Export PDF
                </button>
                <button onClick={() => handleExport('Attendance', 'Excel')} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded">
                  📊 Export Excel
                </button>
              </div>
            </div>

            {/* Employee Performance Report Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Employee Performance Report</h3>
              <p className="text-gray-600 text-sm mb-4">Task completion rates, active projects contribution, and efficiency metrics.</p>
              <div className="flex space-x-2">
                <button onClick={() => handleExport('Performance', 'PDF')} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded">
                  📄 Export PDF
                </button>
                <button onClick={() => handleExport('Performance', 'CSV')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded">
                  📈 Export CSV
                </button>
              </div>
            </div>

            {/* Leave & Payroll Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Leaves & Payroll Summary</h3>
              <p className="text-gray-600 text-sm mb-4">Approved/pending leaves summary, casual and sick leave allocations per employee.</p>
              <div className="flex space-x-2">
                <button onClick={() => handleExport('Payroll', 'PDF')} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded">
                  📄 Export PDF
                </button>
                <button onClick={() => handleExport('Payroll', 'Excel')} className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold px-3 py-2 rounded">
                  📊 Export Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
