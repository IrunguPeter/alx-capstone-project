import React from 'react';

const Navbar = ({ onNewBuild }) => {
  const navLinks = [
    { name: 'Dashboard', href: '#', active: true },
    { name: 'Hardware 2026', href: '#' },
    { name: 'Support', href: '#' },
  ];

  return (
    <nav className="bg-ivory/90 backdrop-blur-md px-6 md:px-10 py-5 flex items-center justify-between border-b border-ink/10 sticky top-0 z-50">
      {/* Left Section: Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={`font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
              link.active ? 'text-ink' : 'text-ink/40 hover:text-ink'
            }`}
          >
            {link.name}
          </a>
        ))}
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-5 ml-auto">
        <button 
          onClick={onNewBuild}
          className="bg-burgundy hover:bg-burgundy-deep text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-colors active:scale-[0.98]"
        >
          New Build
        </button>
        <div className="w-10 h-10 rounded-full bg-white border border-ink/10 flex items-center justify-center text-ink/50 cursor-pointer hover:border-burgundy/40 hover:text-burgundy transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
