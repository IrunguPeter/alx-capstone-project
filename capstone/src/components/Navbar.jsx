import React from 'react';

const Navbar = () => {
  const navLinks = ['Dashboard', 'Team', 'Projects', 'Calendar'];

  return (
    <nav className="bg-[#111827] px-6 py-3 flex items-center justify-between border-b border-gray-800">
      {/* Left Section: Logo & Links */}
      <div className="flex items-center space-x-8">
        {/* Logo - Placeholder for the purple icon */}
        <div className="text-indigo-500">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className={`${
                link === 'Dashboard' 
                ? 'bg-[#1F2937] text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              {link}
            </a>
          ))}
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center space-x-6">
        {/* Quick Action Button */}
        <button className="flex items-center bg-[#6366F1] hover:bg-[#4F46E5] text-white px-4 py-2 rounded-md text-sm font-semibold transition-shadow">
          <span className="mr-2 text-lg leading-none">+</span>
          New Job
        </button>

        {/* Notification Bell */}
        <button className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* Profile Avatar */}
        <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-700">
          <img 
            src="https://via.placeholder.com/150" 
            alt="Profile" 
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;