import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'HIGH', dueDate: '', status: 'TODO' });
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [user, setUser] = useState(null);

  const getAuthHeader = () => {
    const u = JSON.parse(localStorage.getItem('user'));
    const token = u?.accessToken || u?.token;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    setUser(u);
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/tasks', getAuthHeader());
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/employees', getAuthHeader());
      setEmployees(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchComments = async (taskId) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/tasks/${taskId}/comments`, getAuthHeader());
      setComments(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchAttachments = async (taskId) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/tasks/${taskId}/attachments`, getAuthHeader());
      setAttachments(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/api/tasks', formData, getAuthHeader());
      setShowCreateModal(false);
      setFormData({ title: '', description: '', priority: 'HIGH', dueDate: '', status: 'TODO' });
      fetchTasks();
    } catch (err) { 
      console.error(err);
      alert("Failed to save task. Please make sure the server is running and try again.");
    }
  };

  const handleOpenTask = (t) => {
    setSelectedTask(t);
    setShowDetailModal(true);
    fetchComments(t.id);
    fetchAttachments(t.id);
  };

  const handleUpdateStatus = async (status) => {
    try {
      await axios.put(`http://localhost:8081/api/tasks/${selectedTask.id}/status`, { status }, getAuthHeader());
      fetchTasks();
      setSelectedTask({...selectedTask, status});
    } catch (err) { console.error(err); }
  };

  const handleAssignTask = async (employeeId) => {
    try {
      await axios.post(`http://localhost:8081/api/tasks/${selectedTask.id}/assign`, { employeeId }, getAuthHeader());
      fetchTasks();
      const emp = employees.find(e => e.id.toString() === employeeId.toString());
      setSelectedTask({...selectedTask, assignedTo: emp});
    } catch (err) { console.error(err); }
  };

  const handleAddComment = async () => {
    if(!commentText.trim()) return;
    try {
      await axios.post(`http://localhost:8081/api/tasks/${selectedTask.id}/comments`, { content: commentText, authorId: user.id }, getAuthHeader());
      setCommentText('');
      fetchComments(selectedTask.id);
    } catch (err) { console.error(err); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const formDataObj = new FormData();
    formDataObj.append('file', file);
    try {
      await axios.post(`http://localhost:8081/api/tasks/${selectedTask.id}/attachments`, formDataObj, {
        headers: { ...getAuthHeader().headers, 'Content-Type': 'multipart/form-data' }
      });
      fetchAttachments(selectedTask.id);
    } catch (err) { console.error(err); }
  };

  const isManagerOrAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_MANAGER');

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Tasks Board</h1>
            <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition font-semibold">
              + New Task
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.length > 0 ? tasks.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOpenTask(t)}>
                    <td className="px-6 py-4 font-medium text-gray-900">{t.title}</td>
                    <td className="px-6 py-4 text-gray-600">{t.assignedTo ? `${t.assignedTo.firstName || ''} ${t.assignedTo.lastName || ''}` : 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded font-bold ${t.priority === 'HIGH' || t.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{t.dueDate}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="px-2 py-1 bg-gray-200 rounded text-xs font-semibold">{t.status}</span>
                    </td>
                  </tr>
                )) : <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No tasks found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <input className="w-full border p-2 mb-3 rounded" placeholder="Task Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              <textarea className="w-full border p-2 mb-3 rounded" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              <select className="w-full border p-2 mb-3 rounded" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="CRITICAL">Critical Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
              <label className="text-xs text-gray-500 font-semibold block mb-1">Due Date</label>
              <input className="w-full border p-2 mb-4 rounded" type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedTask.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedTask.description}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-red-500 text-2xl font-bold">&times;</button>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Comments</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto mb-3 bg-gray-50 p-3 rounded border">
                    {comments.map(c => (
                      <div key={c.id} className="bg-white p-2 rounded shadow-sm border border-gray-100">
                        <p className="text-xs font-bold text-blue-600">{c.author?.firstName || 'User'} {c.author?.lastName || ''} <span className="text-gray-400 font-normal">{new Date(c.createdAt).toLocaleString()}</span></p>
                        <p className="text-sm text-gray-800 mt-1">{c.content}</p>
                      </div>
                    ))}
                    {comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" className="flex-1 border p-2 rounded" placeholder="Add a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} />
                    <button onClick={handleAddComment} className="bg-blue-600 text-white px-4 rounded font-semibold hover:bg-blue-700">Send</button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Attachments</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {attachments.map(att => (
                      <a key={att.id} href={`http://localhost:8081/${att.filePath}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 text-sm text-blue-600">
                        📄 {att.fileName}
                      </a>
                    ))}
                    {attachments.length === 0 && <span className="text-sm text-gray-500 block mb-2">No attachments.</span>}
                  </div>
                  <input type="file" onChange={handleFileUpload} className="text-sm text-gray-600" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded border">
                  <h4 className="font-semibold text-gray-700 mb-2">Details</h4>
                  <p className="text-sm mb-1"><span className="font-medium">Priority:</span> {selectedTask.priority}</p>
                  <p className="text-sm mb-1"><span className="font-medium">Due:</span> {selectedTask.dueDate}</p>
                  
                  <div className="mt-3 border-t pt-3">
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Status</label>
                    <select className="w-full border p-2 rounded text-sm" value={selectedTask.status} onChange={(e) => handleUpdateStatus(e.target.value)}>
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="BLOCKED">Blocked</option>
                    </select>
                  </div>

                  {isManagerOrAdmin && (
                    <div className="mt-3 border-t pt-3">
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Assignee</label>
                      <select className="w-full border p-2 rounded text-sm" value={selectedTask.assignedTo?.id || ''} onChange={(e) => handleAssignTask(e.target.value)}>
                        <option value="">Unassigned</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {!isManagerOrAdmin && selectedTask.assignedTo && (
                    <div className="mt-3 border-t pt-3">
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Assignee</label>
                      <p className="text-sm">{selectedTask.assignedTo.firstName} {selectedTask.assignedTo.lastName}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}