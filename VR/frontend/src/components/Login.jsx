import React, { useState, useEffect } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    // Show demo credentials after 2 seconds
    const timer = setTimeout(() => setShowDemo(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username.trim() && password.trim()) {
      const role = username === 'admin' ? 'admin' : 'trainee';
      onLogin({ username, role });
    } else {
      setError('Please enter both username and password');
    }
    setIsLoading(false);
  };

  const quickLogin = (user, pass, role) => {
    setUsername(user);
    setPassword(pass);
    setTimeout(() => onLogin({ username: user, role }), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-md w-full mx-4">
        {/* Floating particles animation */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        
        <div className="px-8 py-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-primary-600 mb-2">
              Sentinel VR
            </h2>
            <p className="text-neutral-600 text-sm">Chemical Disaster Response Training</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Enter your password"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In to VR Training'
              )}
            </button>
          </form>

          {/* Quick Login Options */}
          {showDemo && (
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <p className="text-sm text-neutral-600 text-center mb-4">Quick Demo Access:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => quickLogin('admin', 'admin', 'admin')}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                >
                  Admin Demo
                </button>
                <button
                  onClick={() => quickLogin('trainee', 'demo', 'trainee')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
                >
                  Trainee Demo
                </button>
              </div>
            </div>
          )}

          {/* Features Preview */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3">
                <div className="text-2xl mb-1">🎮</div>
                <div className="text-xs text-neutral-600">VR Training</div>
              </div>
              <div className="p-3">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-xs text-neutral-600">AI Analytics</div>
              </div>
              <div className="p-3">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-xs text-neutral-600">Progress Tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;