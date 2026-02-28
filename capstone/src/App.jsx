import { useState, useRef } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Questions from './components/Questions';
import Build from './components/Build';

function App() {
  const buildSectionRef = useRef(null);

  const scrollToBuild = () => {
    buildSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      {/* 1. Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2000&auto=format&fit=crop" 
          alt="High-end Gaming PC 2026" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                Building a PC in <span className="text-blue-400">2026</span> made simple.
              </h1>
              <p className="mt-4 text-xl text-slate-300">
                Leverage AI to find the perfect balance of 
                performance and price for your next build.
              </p>
              <button 
                onClick={scrollToBuild}
                className="mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all active:scale-95"
              >
                Start Your Build
              </button>
            </div>
          </div>
        </div>
      </div>

      <Header />

      {/* 2. Main Build Tool Section */}
      <main ref={buildSectionRef} className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Side: Info Text */}
          <div className="lg:col-span-4 mb-6">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Why our AI Architect?</h2>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-600 p-1 rounded-full text-xs">✔</span>
                <span>Optimizes for your specific budget.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-600 p-1 rounded-full text-xs">✔</span>
                <span>Checks for motherboard and PSU compatibility.</span>
              </li>
            </ul>
            
            <div className="mt-10 p-6 bg-blue-600 rounded-3xl text-white shadow-xl">
              <p className="text-sm opacity-80 mb-2">Build Tip:</p>
              <p className="font-medium italic">"In 2026, don't settle for less than 32GB of RAM if you're multitasking while gaming."</p>
            </div>
          </div>

          {/* Right Side: The Interactive Component */}
          <div className="lg:col-span-8">
             <Questions />
          </div>

        </div>
        {/*This iw where I plan to render Build.jsx */}
        <div className="px-4 justify-center mx-4 rounded-xl text-center py-29 p-4 border shadow-lg hover:bg-blue-500 flex flex-col gap-4">
          <button className="mb-6">{/*Onclick this button renders the build component*/}
            <h1 className="strong">
              Start A Manual Build

            </h1>
          </button>
        </div>
        <Build/>
      </main>

      {/*footer*/}
      <footer className="bg-white border-t border-slate-200 py-10 text-center">
        <p className="mt-4 text-slate-400 text-sm">© 2026 PC Part Picker. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;