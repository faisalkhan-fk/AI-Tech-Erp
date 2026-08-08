import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function AI() {
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [report, setReport] = useState('');
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.accessToken || user?.token;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const generateReport = async () => {
    setLoadingReport(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/ai/report`, getAuthHeader());
      setReport(res.data.report);
    } catch (err) { 
      console.error(err);
      setReport("Failed to generate report. Make sure backend is running.");
    } finally {
      setLoadingReport(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    setLoadingChat(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/ai/chat`, { query: chatQuery }, getAuthHeader());
      setChatResponse(res.data.response);
    } catch (err) { 
      console.error(err);
      setChatResponse("AI Assistant is currently unavailable.");
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Workspace</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Report Generator */}
            <div className="bg-white p-6 rounded-lg shadow border-t-4 border-purple-500">
              <h2 className="text-xl font-bold mb-4 text-gray-800">AI Daily Report Generator</h2>
              <button 
                onClick={generateReport} 
                disabled={loadingReport}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded shadow transition mb-4 font-semibold"
              >
                {loadingReport ? 'Generating Report...' : 'Generate End-of-Day Report'}
              </button>
              {report && (
                <div className="bg-purple-50 p-4 rounded text-purple-900 border-l-4 border-purple-400 whitespace-pre-line text-sm leading-relaxed font-medium">
                  {report}
                </div>
              )}
            </div>

            {/* AI HR Assistant */}
            <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
              <h2 className="text-xl font-bold mb-4 text-gray-800">AI HR Assistant</h2>
              <form onSubmit={handleChat} className="mb-4 flex">
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Ask about policies, leaves, etc..." 
                  value={chatQuery} 
                  onChange={e => setChatQuery(e.target.value)} 
                  required 
                />
                <button 
                  type="submit" 
                  disabled={loadingChat}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition font-bold disabled:opacity-50"
                >
                  {loadingChat ? 'Asking...' : 'Ask AI'}
                </button>
              </form>
              {chatResponse && (
                <div className="bg-blue-50 p-4 rounded text-blue-900 font-medium border-l-4 border-blue-400">
                  🤖 {chatResponse}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}