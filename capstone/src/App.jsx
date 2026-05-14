import { useRef } from 'react';
import Navbar from './components/Navbar';
import Questions from './components/Questions';
import Build from './components/Build';
import Checkout from './components/checkout';
import heroImage from './assets/hero-pc.jpg';

function App() {
  const buildSectionRef = useRef(null);
  const manualBuildRef = useRef(null);

  const scrollToBuild = () => {
    buildSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToManualBuild = () => {
    manualBuildRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 cyber-grid">
      <Navbar onNewBuild={scrollToBuild} />
      
      {/* 1. Hero Section */}
      <div className="relative min-h-[700px] md:h-[750px] w-full overflow-hidden border-b border-slate-100 flex items-center">
        <img 
          src={heroImage} 
          alt="High-end Gaming PC 2026" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Transparent overlay with centered glass card */}
        <div className="absolute inset-0 bg-black/10 flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-8 w-full">
            <div className="max-w-3xl fade-up p-8 md:p-14 glass-panel rounded-[2.5rem] md:rounded-[3rem] border-white/40 shadow-[0_32px_64px_-16px_rgba(99,102,241,0.15)] mt-16 md:mt-0">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight">
                Building a PC in <span className="text-indigo-600">2026</span> <br className="hidden md:block" /> made simple.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
                Leverage advanced AI to find the perfect balance of 
                performance and price for your next-gen build.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-10">
                <button 
                  onClick={scrollToBuild}
                  className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 md:px-10 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 glow-btn whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span>Start AI Build</span>
                </button>
                <button 
                  onClick={scrollToManualBuild}
                  className="flex-1 sm:flex-none bg-white/80 hover:bg-white text-slate-900 border border-slate-200 backdrop-blur-md font-bold py-4 px-8 md:px-10 rounded-2xl transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  <span>Manual Configurator</span>
                </button>
                <div className="w-full lg:w-auto pt-2 lg:pt-0">
                  <Checkout label="Donate" allowCustomAmount={true} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements effect (subtle) */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-40 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-float delay-1000"></div>
      </div>

      {/* 2. Main Build Tool Section */}
      <main ref={buildSectionRef} className="max-w-7xl mx-auto px-8 py-32 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Side: Info Text */}
          <div className="lg:col-span-4 mb-6">
            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Why our AI Architect?</h2>
            <ul className="space-y-6 text-slate-600">
              <li className="flex items-start gap-4 p-5 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <span className="bg-indigo-50 text-indigo-600 p-2 rounded-xl text-xs font-bold border border-indigo-100">✔</span>
                <span className="font-semibold text-lg">Optimizes for your specific budget.</span>
              </li>
              <li className="flex items-start gap-4 p-5 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <span className="bg-indigo-50 text-indigo-600 p-2 rounded-xl text-xs font-bold border border-indigo-100">✔</span>
                <span className="font-semibold text-lg">Checks for motherboard and PSU compatibility.</span>
              </li>
              <li className="flex items-start gap-4 p-5 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <span className="bg-indigo-50 text-indigo-600 p-2 rounded-xl text-xs font-bold border border-indigo-100">✔</span>
                <span className="font-semibold text-lg">Updated daily with 2026 hardware market data.</span>
              </li>
            </ul>
            
            <div className="mt-12 p-10 glass-panel rounded-[2.5rem] border-indigo-50">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4 opacity-60">Tech Tip 2026</p>
              <p className="text-2xl font-medium italic leading-relaxed text-slate-700">"In 2026, don't settle for less than 32GB of RAM."</p>
            </div>
          </div>

          {/* Right Side: The Interactive Component */}
          <div className="lg:col-span-8">
             <Questions />
          </div>

        </div>

        {/* Manual Build Section */}
        <div ref={manualBuildRef} className="mt-48 pt-32 border-t border-slate-100 bg-white">
          <div className="text-center mb-20">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-4 block">Precision Control</span>
            <h2 className="text-5xl font-black text-slate-900 mb-6">Manual Configurator</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-xl leading-relaxed">
              Prefer to pick your own parts? Use our high-precision wizard to build your dream machine manually.
            </p>
          </div>
          <Build />
        </div>
      </main>

      {/*footer*/}
      <footer className="bg-slate-50 border-t border-slate-100 py-24 text-center">
        <div className="flex justify-center items-center gap-2 mb-8">
          <div className="text-indigo-600">
            <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-slate-900 font-black text-2xl tracking-tight">PART<span className="text-indigo-600">PICKER</span></span>
        </div>
        <p className="text-slate-400 text-sm font-bold tracking-wide">© 2026 PC Part Picker. Neural-optimized Architecture.</p>
      </footer>
    </div>
  );
}

export default App;