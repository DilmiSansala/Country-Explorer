import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SessionContext } from '../contexts/SessionContext';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useContext(SessionContext);

  return (
    <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 shadow-xl relative z-50">
      {/* Decorative top border */}
      <div className="h-1 w-full bg-gradient-to-r from-rose-400 via-amber-400 to-teal-400"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" fill="none">
          <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.5" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 py-5 flex justify-between items-center relative z-10">
        <Link 
          to="/" 
          className="flex items-center space-x-3 group"
        >
          <div className="p-2 bg-white rounded-lg shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
            <svg 
              className="w-7 h-7 text-indigo-600 transform group-hover:scale-110 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight group-hover:text-indigo-100 transition-colors duration-300">
              Countries Explorer
            </span>
            <span className="text-xs text-indigo-200">Discover our beautiful world</span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium">
                  {user.username}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-rose-500/30 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </div>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 bg-white text-indigo-700 rounded-xl font-semibold shadow-lg hover:shadow-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;