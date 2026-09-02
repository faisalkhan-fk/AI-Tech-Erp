import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return { headers: { Authorization: `Bearer ${user?.token}` } };
};

export default function Reports() {
  const [downloadMsg, setDownloadMsg] = useState('');

  const exportData = (data, head, filename, format) => {
    if (format === 'PDF') {
      const doc = new jsPDF();
      doc.text(filename.replace(/_/g, ' '), 14, 15);
      autoTable(doc, {
        head: head,
        body: data,
        startY: 20
      });
      doc.save(`${filename}.pdf`);
    } else if (format === 'Excel' || format === 'CSV') {
      const ws = XLSX.utils.aoa_to_sheet([...head, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      const extension = format === 'Excel' ? 'xlsx' : 'csv';
      XLSX.writeFile(wb, `${filename}.${extension}`);
    }
  };

  const handleExport = async (type, format) => {
    setDownloadMsg(`Generating ${type} report in ${format} format...`);
    try {
      if (type === 'Attendance') {
        const res = await axios.get(`${API_URL}/api/attendance`, getAuthHeader());
        const data = res.data.map(item => [
          item.date,
          item.employee ? `${item.employee.firstName} ${item.employee.lastName}` : 'Unknown',
          item.checkIn ? item.checkIn.substring(0, 5) : '-',
          item.checkOut ? item.checkOut.substring(0, 5) : '-',
          item.workingHours ? item.workingHours.toFixed(2) : '-',
          item.status
        ]);
        const head = [['Date', 'Employee', 'Check-In', 'Check-Out', 'Hours', 'Status']];
        exportData(data, head, 'Monthly_Attendance_Report', format);
      } 
      else if (type === 'Performance') {
        const [empRes, taskRes] = await Promise.all([
          axios.get(`${API_URL}/api/employees`, getAuthHeader()),
          axios.get(`${API_URL}/api/tasks`, getAuthHeader())
        ]);
        
        const employees = empRes.data;
        const tasks = taskRes.data;
        
        const data = employees.map(emp => {
          const empTasks = tasks.filter(t => t.assignees && t.assignees.some(a => a.id === emp.id));
          const total = empTasks.length;
          const completed = empTasks.filter(t => t.status === 'COMPLETED').length;
          const pending = empTasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
          const rate = total > 0 ? ((completed/total)*100).toFixed(0) + '%' : '0%';
          return [
            `${emp.firstName} ${emp.lastName}`,
            emp.department ? emp.department.name : '-',
            total,
            completed,
            pending,
            rate
          ];
        });
        const head = [['Employee Name', 'Department', 'Total Tasks', 'Completed', 'Pending', 'Completion Rate']];
        exportData(data, head, 'Employee_Performance_Report', format);
      }
      else if (type === 'Payroll') {
        const res = await axios.get(`${API_URL}/api/leaves`, getAuthHeader());
        const data = res.data.map(item => [
          item.employee ? `${item.employee.firstName} ${item.employee.lastName}` : 'Unknown',
          item.type,
          item.startDate,
          item.endDate,
          item.status
        ]);
        const head = [['Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Status']];
        exportData(data, head, 'Leaves_Payroll_Summary', format);
      }
      setDownloadMsg(`Successfully exported ${type} report!`);
      setTimeout(() => setDownloadMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setDownloadMsg(`Error exporting ${type} report.`);
      setTimeout(() => setDownloadMsg(''), 3000);
    }
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
