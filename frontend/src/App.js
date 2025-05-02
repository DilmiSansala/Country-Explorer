// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './contexts/SessionContext';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './index.css';

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <NavBar />
          <main className="pb-12">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/country/:code" element={<DetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;