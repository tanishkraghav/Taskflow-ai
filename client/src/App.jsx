import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function MainApp() {
  const { user, loading } = useAuth();
  // Manage client routing locally ('login' | 'register')
  const [currentView, setCurrentView] = useState('login');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-950 text-slate-100">
        <div className="w-10 h-10 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Verifying session...</span>
      </div>
    );
  }

  // Protected View (Dashboard)
  if (user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
        <Navbar />
        <Dashboard />
      </div>
    );
  }

  // Guest Views (Login/Register)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      {currentView === 'login' ? (
        <Login onNavigate={setCurrentView} />
      ) : (
        <Register onNavigate={setCurrentView} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
