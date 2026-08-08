import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    designation: '',
    phone: '',
    profilePic: ''
  });

  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.accessToken || user?.token;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/employees`, getAuthHeader());
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/employees`, formData, getAuthHeader());
      setShowAddModal(false);
      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error('Failed to add employee', err);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/employees/${selectedEmployee.id}`, formData, getAuthHeader());
      setShowEditModal(false);
      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error('Failed to update employee', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/employees/${id}`, getAuthHeader());
        fetchEmployees();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Approve this user for login access?')) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/employees/${id}/approve`, {}, getAuthHeader());
        fetchEmployees();
        alert('User approved successfully!');
      } catch (err) {
        console.error('Failed to approve user', err);
        alert('Failed to approve user.');
      }
    }
  };

  const getUserDetails = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    const role = user.roles ? (user.roles.includes('ROLE_ADMIN') ? 'ADMIN' : user.roles.includes('ROLE_MANAGER') ? 'MANAGER' : 'EMPLOYEE') : 'EMPLOYEE';
    return { ...user, role };
  };
  const currentUser = getUserDetails();

  const openEditModal = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      designation: emp.designation || '',
      phone: emp.phone || '',
      profilePic: emp.profilePic || ''
    });
    setShowEditModal(true);
  };

  const openProfileModal = (emp) => {
    setSelectedEmployee(emp);
    setShowProfileModal(true);
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', designation: '', phone: '', profilePic: '' });
    setSelectedEmployee(null);
  };

  // Filtered employees list
  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          (emp.email && emp.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (emp.designation && emp.designation.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterDesignation === 'ALL' || emp.designation === filterDesignation;
    return matchesSearch && matchesFilter;
  });

  const uniqueDesignations = Array.from(new Set(employees.map(e => e.designation).filter(Boolean)));

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
              <p className="text-gray-500 text-sm mt-1">Manage staff directory, profile pictures, and department assignments</p>
            </div>
            <div className="flex space-x-3">
              {currentUser?.role === 'ADMIN' && (
                <>
                  <Link to="/departments" className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded shadow transition font-semibold text-sm flex items-center gap-1">
                    🏢 Department Management
                  </Link>
                  <button 
                    onClick={() => { resetForm(); setShowAddModal(true); }} 
                    className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition font-semibold text-sm"
                  >
                    + Add Employee
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/2 relative">
              <input 
                type="text" 
                placeholder="🔍 Search employee by name, email, or designation..." 
                className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3 flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-600">Filter Designation:</label>
              <select 
                className="flex-1 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={filterDesignation}
                onChange={e => setFilterDesignation(e.target.value)}
              >
                <option value="ALL">All Designations</option>
                {uniqueDesignations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add Employee Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Employee</h2>
                <form onSubmit={handleAddEmployee}>
                  <div className="mb-4 text-center">
                    {formData.profilePic ? (
                      <img src={formData.profilePic} alt="Preview" className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary mb-2" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-400 text-2xl font-bold mb-2">👤</div>
                    )}
                    <label className="text-xs text-primary font-bold cursor-pointer hover:underline">
                      Upload Profile Picture
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>

                  <input className="w-full border p-2 mb-3 rounded text-sm" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                  <input className="w-full border p-2 mb-3 rounded text-sm" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                  <input className="w-full border p-2 mb-3 rounded text-sm" type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  <input className="w-full border p-2 mb-3 rounded text-sm" placeholder="Designation (e.g. Senior AI Engineer)" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} required />
                  <input className="w-full border p-2 mb-4 rounded text-sm" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded text-sm hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white text-sm rounded font-bold hover:bg-blue-700">Save Employee</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Employee Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Employee</h2>
                <form onSubmit={handleUpdateEmployee}>
                  <div className="mb-4 text-center">
                    {formData.profilePic ? (
                      <img src={formData.profilePic} alt="Preview" className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary mb-2" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-400 text-2xl font-bold mb-2">👤</div>
                    )}
                    <label className="text-xs text-primary font-bold cursor-pointer hover:underline">
                      Change Profile Picture
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>

                  <input className="w-full border p-2 mb-3 rounded text-sm" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                  <input className="w-full border p-2 mb-3 rounded text-sm" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                  <input className="w-full border p-2 mb-3 rounded text-sm" type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  <input className="w-full border p-2 mb-3 rounded text-sm" placeholder="Designation" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} required />
                  <input className="w-full border p-2 mb-4 rounded text-sm" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded text-sm hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded font-bold hover:bg-blue-700">Update Employee</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Profile Modal */}
          {showProfileModal && selectedEmployee && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
                {selectedEmployee.profilePic ? (
                  <img src={selectedEmployee.profilePic} alt="Profile" className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary mb-3 shadow" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center text-3xl font-bold mb-3 border-2 border-primary">
                    {selectedEmployee.firstName?.[0]}{selectedEmployee.lastName?.[0]}
                  </div>
                )}
                <h2 className="text-2xl font-extrabold text-gray-800">{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
                <p className="text-primary font-bold text-sm mb-4">{selectedEmployee.designation}</p>

                <div className="bg-gray-50 p-4 rounded-lg text-left text-sm space-y-2 mb-6 border">
                  <div><span className="font-semibold text-gray-500">Employee ID:</span> #{selectedEmployee.id}</div>
                  <div><span className="font-semibold text-gray-500">Email:</span> {selectedEmployee.email}</div>
                  <div><span className="font-semibold text-gray-500">Phone:</span> {selectedEmployee.phone || 'N/A'}</div>
                  <div><span className="font-semibold text-gray-500">Status:</span> <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">ACTIVE</span></div>
                </div>

                <button onClick={() => setShowProfileModal(false)} className="w-full bg-gray-800 text-white font-bold py-2 rounded hover:bg-gray-900 transition">
                  Close Profile
                </button>
              </div>
            </div>
          )}

          {/* Employee Directory Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {emp.profilePic ? (
                        <img src={emp.profilePic} alt="Avatar" className="w-10 h-10 rounded-full object-cover border" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {emp.firstName?.[0]}{emp.lastName?.[0]}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{emp.firstName} {emp.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">{emp.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm font-medium">{emp.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-3 text-sm">
                      <button onClick={() => openProfileModal(emp)} className="text-blue-600 hover:text-blue-800 font-semibold">View</button>
                      
                      {currentUser?.role === 'ADMIN' && emp.user && emp.user.approved === false && (
                        <button onClick={() => handleApprove(emp.id)} className="text-green-600 hover:text-green-800 font-semibold">Approve Login</button>
                      )}

                      {(currentUser?.role === 'ADMIN' || (emp.user && emp.user.id === currentUser?.id)) && (
                        <button onClick={() => openEditModal(emp)} className="text-yellow-600 hover:text-yellow-800 font-semibold">Edit</button>
                      )}

                      {currentUser?.role === 'ADMIN' && (
                        <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      {searchQuery ? `No employees matching "${searchQuery}"` : "No employees found. Click '+ Add Employee' to add one."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}