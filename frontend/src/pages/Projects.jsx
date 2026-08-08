import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedProjectReport, setSelectedProjectReport] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', description: '', startDate: '', endDate: '', status: 'IN_PROGRESS' });
  const [user, setUser] = useState(null);

  const getAuthHeader = () => {
    const u = JSON.parse(localStorage.getItem('user'));
    const token = u?.accessToken || u?.token;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
    fetchProjects();
    fetchEmployees();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/projects`, getAuthHeader());
      setProjects(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/employees`, getAuthHeader());
      setEmployees(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/projects`, formData, getAuthHeader());
      setShowModal(false);
      setFormData({ name: '', description: '', startDate: '', endDate: '', status: 'IN_PROGRESS' });
      fetchProjects();
    } catch (err) { 
        console.error(err);
        alert("Failed to create project");
    }
  };

  const handleUpdateStatus = async (projectId, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/projects/${projectId}/status`, { status }, getAuthHeader());
      fetchProjects();
    } catch (err) { console.error(err); alert("Failed to update status"); }
  };

  const handleAssignEmployee = async (projectId, employeeId) => {
    if (!employeeId) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/projects/${projectId}/members`, { employeeId }, getAuthHeader());
      fetchProjects();
      if(showReportModal) fetchReport(projectId);
    } catch (err) { console.error(err); alert("Failed to assign employee"); }
  };

  const fetchReport = async (projectId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/projects/${projectId}/report`, getAuthHeader());
      setSelectedProjectReport(res.data);
      setSelectedProjectId(projectId);
      setShowReportModal(true);
    } catch (err) { console.error(err); alert("Failed to fetch project report"); }
  };

  const isManagerOrAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_MANAGER');

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
            {isManagerOrAdmin && (
              <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition font-semibold">
                + Create Project
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? projects.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500 relative flex flex-col h-full">
                <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2 text-gray-800">{p.name}</h2>
                    <p className="text-gray-600 mb-4 text-sm">{p.description}</p>
                    
                    <div className="text-xs text-gray-500 mb-4 space-y-1 font-medium">
                        <p>Timeline: {p.startDate} to {p.endDate}</p>
                        <p>Team Size: {p.teamMembers?.length || 0} Members</p>
                    </div>
                </div>

                <div className="mt-4 border-t pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-gray-500">Status</label>
                        {isManagerOrAdmin ? (
                            <select 
                                className={`text-xs font-bold p-1 rounded border outline-none ${
                                    p.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                    p.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                }`} 
                                value={p.status} 
                                onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                <option value="COMPLETED">COMPLETED</option>
                            </select>
                        ) : (
                            <span className={`px-2 py-1 text-xs rounded font-bold ${
                                p.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                p.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>{p.status}</span>
                        )}
                    </div>
                    
                    <button onClick={() => fetchReport(p.id)} className="w-full text-center bg-gray-100 hover:bg-gray-200 text-blue-600 font-semibold py-2 rounded text-sm transition">
                        View Detailed Report & Progress
                    </button>
                </div>
              </div>
            )) : <p className="text-gray-500 col-span-3 text-center py-8">No projects found.</p>}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Project</h2>
            <form onSubmit={handleCreate}>
              <input className="w-full border p-2 mb-3 rounded" placeholder="Project Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <textarea className="w-full border p-2 mb-3 rounded" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              <label className="text-xs text-gray-500 font-semibold block mb-1">Start Date</label>
              <input className="w-full border p-2 mb-3 rounded" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
              <label className="text-xs text-gray-500 font-semibold block mb-1">End Date</label>
              <input className="w-full border p-2 mb-3 rounded" type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
              <select className="w-full border p-2 mb-4 rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReportModal && selectedProjectReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6 border-b pb-4">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-800">{selectedProjectReport.project.name}</h2>
                <p className="text-gray-600 mt-2">{selectedProjectReport.project.description}</p>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-red-500 text-3xl font-bold leading-none">&times;</button>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Overall Progress</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Task Completion</span>
                    <span className="text-sm font-bold text-blue-600">{selectedProjectReport.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: `${selectedProjectReport.progressPercentage}%` }}></div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-6 text-center">
                    <div className="p-3 bg-white rounded shadow-sm">
                      <p className="text-2xl font-bold text-gray-800">{selectedProjectReport.totalTasks}</p>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Total Tasks</p>
                    </div>
                    <div className="p-3 bg-white rounded shadow-sm">
                      <p className="text-2xl font-bold text-green-600">{selectedProjectReport.completedTasks}</p>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Completed</p>
                    </div>
                    <div className="p-3 bg-white rounded shadow-sm">
                      <p className="text-2xl font-bold text-blue-600">{selectedProjectReport.inProgressTasks}</p>
                      <p className="text-xs text-gray-500 uppercase font-semibold">In Progress</p>
                    </div>
                    <div className="p-3 bg-white rounded shadow-sm">
                      <p className="text-2xl font-bold text-yellow-600">{selectedProjectReport.pendingTasks}</p>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Pending</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Team Members</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProjectReport.project.teamMembers?.map(member => (
                      <div key={member.id} className="bg-white border rounded-full px-4 py-2 flex items-center shadow-sm">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-2">
                            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">{member.firstName} {member.lastName}</p>
                            <p className="text-xs text-gray-500">{member.designation}</p>
                        </div>
                      </div>
                    ))}
                    {(!selectedProjectReport.project.teamMembers || selectedProjectReport.project.teamMembers.length === 0) && (
                        <p className="text-gray-500 text-sm">No members assigned yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-5 rounded-lg border shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-3 text-lg border-b pb-2">Timeline</h4>
                  <div className="space-y-3">
                      <div>
                          <p className="text-xs font-semibold text-gray-500">START DATE</p>
                          <p className="font-medium text-gray-800">{selectedProjectReport.project.startDate}</p>
                      </div>
                      <div>
                          <p className="text-xs font-semibold text-gray-500">END DATE</p>
                          <p className="font-medium text-gray-800">{selectedProjectReport.project.endDate}</p>
                      </div>
                      <div>
                          <p className="text-xs font-semibold text-gray-500">CURRENT STATUS</p>
                          <span className={`px-2 py-1 mt-1 inline-block text-xs rounded font-bold ${
                                selectedProjectReport.project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                selectedProjectReport.project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>{selectedProjectReport.project.status}</span>
                      </div>
                  </div>
                </div>

                {isManagerOrAdmin && (
                  <div className="bg-gray-50 p-5 rounded-lg border">
                    <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Assign to Project</h4>
                    <select className="w-full border p-2 rounded text-sm mb-3 shadow-sm" onChange={(e) => handleAssignEmployee(selectedProjectId, e.target.value)} defaultValue="">
                        <option value="" disabled>Select Employee to Assign</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} - {emp.designation}</option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}