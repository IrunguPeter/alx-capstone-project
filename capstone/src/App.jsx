import { useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Questions from './components/Questions';
import Build from './components/Build';

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
    <div className="min-h-screen bg-ivory font-sans text-ink">
      <Navbar onNewBuild={scrollToBuild} />
      
      {/* 1. Hero Section */}
      <Hero onStartAI={scrollToBuild} onManual={scrollToManualBuild} />

      {/* 2. Main Build Tool Section */}
      <main ref={buildSectionRef} className="max-w-7xl mx-auto px-8 py-32 bg-ivory">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Side: Info Text */}
          <div className="lg:col-span-4 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">The Concierge</span>
            <h2 className="mt-5 font-display font-medium text-4xl text-ink leading-tight">What the Concierge checks</h2>
            <p className="mt-5 text-ink-soft leading-relaxed">Three quiet promises behind every curated build.</p>

            <div className="mt-12 border-y border-ink/10 divide-y divide-ink/10">
              {[
                { n: '01', title: 'Budget, balanced', body: 'Every dollar is apportioned across components — never all in one basket.' },
                { n: '02', title: 'Fits, verified', body: 'Sockets, chassis clearance and PSU wattage are checked as hard rules.' },
                { n: '03', title: 'Real, buyable', body: 'Only current, purchasable 2026 hardware ever leaves the catalogue.' },
              ].map((f) => (
                <div key={f.n} className="py-7">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-gold">{f.n}</span>
                    <h3 className="font-display font-medium text-xl text-ink">{f.title}</h3>
                  </div>
                  <p className="mt-2 pl-9 text-sm text-ink-soft leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 border border-gold/40 p-8 relative">
              <div className="hairline-gold absolute top-0 left-8 right-8" />
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-4">Maison note · 2026</p>
              <p className="font-display font-light italic text-2xl leading-relaxed text-ink">"In 2026, don't settle for less than 32GB of RAM."</p>
            </div>
          </div>

          {/* Right Side: The Interactive Component */}
          <div className="lg:col-span-8">
             <Questions />
          </div>

        </div>

        {/* Manual Build Section */}
        <div ref={manualBuildRef} className="mt-48 pt-32 border-t border-ink/10 bg-ivory">
          <div className="text-center mb-20">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-4 block">Precision, by hand</span>
            <h2 className="font-display font-medium text-5xl text-ink mb-6">Manual Configurator</h2>
            <p className="text-ink-soft max-w-2xl mx-auto text-xl leading-relaxed font-light">
              Prefer to pick your own parts? Use our high-precision wizard to build your dream machine manually.
            </p>
          </div>
          <Build />
        </div>
      </main>

      {/*footer*/}
      <footer className="bg-ivory border-t border-ink/10 py-24 text-center">
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="text-burgundy">
            <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-ink font-display font-medium text-2xl tracking-tight">PART<span className="text-burgundy">PICKER</span></span>
        </div>
        <p className="text-ink/40 text-sm font-medium tracking-wide">© 2026 PC Part Picker. Deterministic, rule-based curation.</p>
      </footer>
    </div>
  );
}

export default App;