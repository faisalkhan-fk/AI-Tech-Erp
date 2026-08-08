import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user && user.accessToken) {
      fetchNotifications();
    }
  }, [location.pathname]); // Fetch when navigating to new pages

  useEffect(() => {
    if (user && user.accessToken) {
      triggerReminders();
      // Check for new reminders every 1 hour (3600000 ms)
      const intervalId = setInterval(() => {
        triggerReminders();
      }, 3600000);
      return () => clearInterval(intervalId);
    }
  }, []); // Run only on mount

  const getAuthHeader = () => {
    return { headers: { Authorization: `Bearer ${user.accessToken || user.token}` } };
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/notifications', getAuthHeader());
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const triggerReminders = async () => {
    try {
      await axios.post('http://localhost:8081/api/notifications/reminders', {}, getAuthHeader());
      // Re-fetch in case reminders were generated
      setTimeout(fetchNotifications, 500);
    } catch (err) {
      console.error("Failed to trigger reminders", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8081/api/notifications/${id}/read`, {}, getAuthHeader());
      fetchNotifications(); // Refresh list
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getRoleBadge = (roles) => {
    if (!roles || roles.length === 0) return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-bold">USER</span>;
    const roleStr = roles.join(', ');
    if (roleStr.includes('ROLE_ADMIN')) {
      return <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs px-2.5 py-1 rounded-full font-bold">🛡️ ADMIN</span>;
    }
    if (roleStr.includes('ROLE_MANAGER')) {
      return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs px-2.5 py-1 rounded-full font-bold">👔 MANAGER</span>;
    }
    return <span className="bg-green-100 text-green-800 border border-green-300 text-xs px-2.5 py-1 rounded-full font-bold">👤 EMPLOYEE</span>;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-6 ml-64 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="text-xl font-bold text-gray-800">Welcome to AI Tech ERP</div>
      </div>
      <div className="flex items-center space-x-6">
        
        {/* Notification Bell */}
        {user.username && (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="relative p-2 text-gray-600 hover:text-blue-600 transition focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border overflow-hidden z-50">
                <div className="bg-gray-50 border-b px-4 py-3 flex justify-between items-center">
                  <h3 className="font-bold text-gray-700">Notifications</h3>
                  {unreadCount > 0 && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded font-semibold">{unreadCount} New</span>}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => { if (!n.read) markAsRead(n.id); }}
                      className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer transition ${!n.read ? 'bg-blue-50/50' : 'opacity-70'}`}
                    >
                      <div className="flex items-start">
                        <div className={`mt-1 mr-3 rounded-full w-2 h-2 flex-shrink-0 ${!n.read ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                        <div>
                          <p className={`text-sm ${!n.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                            {n.message}
                          </p>
                          <span className="text-xs text-gray-400 font-medium uppercase mt-1 block">
                            {n.type} • {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      No notifications right now.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {user.username && (
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
            <span className="text-sm font-semibold text-gray-700">👤 {user.username}</span>
            {getRoleBadge(user.roles)}
          </div>
        )}
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 transition text-white text-sm font-bold px-4 py-2 rounded shadow">
          Logout
        </button>
      </div>
    </div>
  );
}