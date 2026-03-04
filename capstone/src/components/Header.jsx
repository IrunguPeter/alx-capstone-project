import React from 'react';
import { useState, useEffect } from 'react';

const Header = () => {

  return (
    <header className="header text-center p-6 bg-blue-100 shadow-md justify-center">
      <h1 className="text-2xl font-bold text-blue-600">Welcome to PC Part Picker</h1>
      <nav className=" card nav mt-4 text-gray-600 hover:text-red-600 transition-colors duration-300">
        <ul>
          <li><a className="text-left" href="/Home">Home</a></li>
        </ul>
      </nav>

    </header>
    
  );
};

export default Header;
