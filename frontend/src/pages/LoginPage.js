import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SessionContext } from '../contexts/SessionContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(SessionContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Attempt login with backend
      const result = await login(username, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error when user starts typing
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="world-pattern" patternUnits="userSpaceOnUse" width="200" height="200">
              <path d="M25,60 a20,20 0 1,0 0,1 z M75,60 a20,20 0 1,0 0,1 z M125,60 a20,20 0 1,0 0,1 z M175,60 a20,20 0 1,0 0,1 z M25,100 a20,20 0 1,0 0,1 z M75,100 a20,20 0 1,0 0,1 z M125,100 a20,20 0 1,0 0,1 z M175,100 a20,20 0 1,0 0,1 z M25,140 a20,20 0 1,0 0,1 z M75,140 a20,20 0 1,0 0,1 z M125,140 a20,20 0 1,0 0,1 z M175,140 a20,20 0 1,0 0,1 z M50,80 a20,20 0 1,0 0,1 z M100,80 a20,20 0 1,0 0,1 z M150,80 a20,20 0 1,0 0,1 z M50,120 a20,20 0 1,0 0,1 z M100,120 a20,20 0 1,0 0,1 z M150,120 a20,20 0 1,0 0,1 z M50,160 a20,20 0 1,0 0,1 z M100,160 a20,20 0 1,0 0,1 z M150,160 a20,20 0 1,0 0,1 z" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#world-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-block p-3 rounded-full bg-indigo-100 mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to continue exploring the world</p>
          </div>
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleInputChange(setUsername)}
                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : 'Sign In'}
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;