import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SalarySlip() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const user = JSON.parse(userStr);
        const token = user?.accessToken || user?.token;
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployee(res.data);
      } catch (err) {
        console.error("Failed to fetch employee", err);
      }
    };
    fetchEmployee();
  }, [id]);

  if (!employee) return <div className="p-8 text-center">Loading Salary Slip...</div>;

  const baseSalary = employee.salary || 0;
  const hra = baseSalary * 0.20; // 20% HRA
  const da = baseSalary * 0.10; // 10% DA
  const grossSalary = baseSalary + hra + da;
  
  const pf = baseSalary * 0.12; // 12% PF
  const tax = grossSalary > 50000 ? grossSalary * 0.05 : 0; // 5% tax if gross > 50k
  const totalDeductions = pf + tax;
  
  const netSalary = grossSalary - totalDeductions;
  
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow-lg" id="salary-slip">
        
        {/* Header */}
        <div className="border-b-4 border-primary pb-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-primary">AI Tech ERP</h1>
            <p className="text-gray-500 text-sm mt-1">123 Tech Park, Silicon Valley, CA</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">Payslip</h2>
            <p className="text-gray-500 font-semibold">{currentMonth}</p>
          </div>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 border rounded">
          <div>
            <p className="text-sm text-gray-500">Employee Name</p>
            <p className="font-bold text-gray-800">{employee.firstName} {employee.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="font-bold text-gray-800">EMP-{String(employee.id).padStart(4, '0')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Designation</p>
            <p className="font-bold text-gray-800">{employee.designation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-bold text-gray-800">{employee.department ? employee.department.name : 'N/A'}</p>
          </div>
        </div>

        {/* Salary Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Earnings */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Earnings</h3>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-600">Basic Salary</span>
              <span className="font-semibold">₹{baseSalary.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-600">House Rent Allowance (HRA)</span>
              <span className="font-semibold">₹{hra.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-600">Dearness Allowance (DA)</span>
              <span className="font-semibold">₹{da.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-4 pt-2 border-t font-bold text-gray-800">
              <span>Gross Earnings</span>
              <span>₹{grossSalary.toFixed(2)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Deductions</h3>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-600">Provident Fund (PF)</span>
              <span className="font-semibold">₹{pf.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-600">Tax Deducted at Source (TDS)</span>
              <span className="font-semibold">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-4 pt-2 border-t font-bold text-gray-800">
              <span>Total Deductions</span>
              <span>₹{totalDeductions.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Net Salary */}
        <div className="bg-primary/10 border border-primary p-4 rounded text-center mb-8">
          <p className="text-gray-600 font-semibold mb-1">Net Salary Payable</p>
          <h2 className="text-4xl font-extrabold text-primary">₹{netSalary.toFixed(2)}</h2>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 mt-16 pt-8 border-t text-center">
          <div>
            <div className="w-40 border-b border-gray-400 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500 font-semibold">Employer Signature</p>
          </div>
          <div>
            <div className="w-40 border-b border-gray-400 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500 font-semibold">Employee Signature</p>
          </div>
        </div>
      </div>

      {/* Action Buttons (Hidden on Print) */}
      <div className="max-w-3xl mx-auto mt-6 flex justify-between print:hidden">
        <button onClick={() => navigate(-1)} className="bg-gray-600 text-white px-6 py-2 rounded shadow hover:bg-gray-700 font-bold">
          ← Back
        </button>
        <button onClick={handlePrint} className="bg-primary text-white px-8 py-2 rounded shadow hover:bg-blue-800 font-bold flex items-center gap-2">
          🖨️ Print / Download PDF
        </button>
      </div>
      
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          #salary-slip { box-shadow: none; padding: 0; }
        }
      `}} />
    </div>
  );
}
