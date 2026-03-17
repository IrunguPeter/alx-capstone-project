import React from 'react';

const Navbar = ({ onNewBuild }) => {
  const navLinks = [
    { name: 'Dashboard', href: '#', active: true },
    { name: 'Hardware 2026', href: '#' },
    { name: 'Support', href: '#' },
  ];

  return (
    <nav className="bg-[#111827] px-6 py-4 flex items-center justify-between border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      {/* Left Section: Logo & Links */}
      <div className="flex items-center space-x-10">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="text-indigo-500 group-hover:scale-110 transition-transform">
            <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-white font-black text-xl tracking-tight">PART<span className="text-indigo-500">PICKER</span></span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`${
                link.active 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              } px-4 py-2 rounded-xl text-sm font-semibold transition-all`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onNewBuild}
          className="flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          New Build
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 cursor-pointer hover:border-indigo-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;