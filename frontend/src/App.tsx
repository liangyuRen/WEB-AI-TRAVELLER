import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TravelPlanner from './pages/TravelPlanner';
import BudgetManager from './pages/BudgetManager';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import { useAuthStore } from './store/authStore';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      await checkAuth();
      setIsInitialized(true);
    };

    initialize();
  }, [checkAuth]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      {user ? (
        <>
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<TravelPlanner />} />
            <Route path="/budget" element={<BudgetManager />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
