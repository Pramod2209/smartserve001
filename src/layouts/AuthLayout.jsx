import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import DotGrid from '../components/DotGrid';

/**
 * Simple layout for authentication pages
 * Just a centered form with minimal header
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 relative">
      {/* DotGrid background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <DotGrid
          dotSize={10}
          gap={15}
          baseColor="#2F293A"
          activeColor="#ffffff"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* Simple header */}
      <header className="bg-gray-950/80 border-b border-gray-800 py-4 relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Smart Serve Logo" className="h-12 w-auto object-contain" />
            <span className="text-2xl font-bold text-white">
              Smart Serve
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default AuthLayout;
