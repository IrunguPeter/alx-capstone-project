import React from 'react';

const Navbar = () => {
  const navLinks = ['Dashboard'];

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
          New Build
        </button>
      </div>
    </nav>
  );
};

export default Navbar;