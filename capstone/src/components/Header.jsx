import React from 'react';

const Header = () => {
  return (
    <header className="header text-center p-6 bg-blue-100 shadow-md justify-center">
      <h1 className="text-2xl font-bold text-blue-600">Welcome to PC Part Picker</h1>
      <nav className=" card nav mt-4 text-gray-600 hover:text-red-600 transition-colors duration-300">
        <ul>
          <li><a href="/Home">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    
  );
};

export default Header;
