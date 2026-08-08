import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');

  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.accessToken || user?.token;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/departments`, getAuthHeader());
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/departments`, { name }, getAuthHeader());
      setShowModal(false);
      setName('');
      fetchDepartments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/departments/${id}`, getAuthHeader());
      fetchDepartments();
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
            <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
            <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition font-semibold">
              + Add Department
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Department</h2>
                <form onSubmit={handleAddDepartment}>
                  <input 
                    className="w-full border p-2.5 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-primary" 
                    placeholder="Department Name (e.g. AI Research, HR, Sales)" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded font-bold hover:bg-blue-700">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.length > 0 ? departments.map(d => (
              <div key={d.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{d.name}</h3>
                  <span className="text-xs text-gray-500">ID: #{d.id}</span>
                </div>
                <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm">
                  Delete
                </button>
              </div>
            )) : <p className="text-gray-500 col-span-3 text-center py-8">No departments found. Click "+ Add Department" to create one.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
