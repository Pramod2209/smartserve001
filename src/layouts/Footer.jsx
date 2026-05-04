import React from 'react';

/**
 * Footer component
 * Displays copyright information
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950/80 border-t border-gray-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 text-center text-sm text-white">
        <p>© {currentYear} Smart Serve. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
