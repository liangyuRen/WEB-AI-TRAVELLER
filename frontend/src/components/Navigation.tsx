import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navigation() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ✈️ AI Travel Planner
          </Link>
          <div className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/planner" className="text-gray-600 hover:text-blue-600">
              Planner
            </Link>
            <Link to="/budget" className="text-gray-600 hover:text-blue-600">
              Budget
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-blue-600">
              Settings
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
