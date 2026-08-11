import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  Cpu, 
  Gamepad2, 
  HardDrive, 
  MemoryStick, 
  Layout, 
  Box, 
  Wind,
  Zap,
  ArrowRight,
  FileDown,
  Loader2,
  Gem
} from 'lucide-react';
import { exportToPDF } from '../utils/pdfExport';
import { composeBuild } from '../utils/curator';
import Checkout from './checkout';

const PRESETS = [
  { label: 'Budget', value: '800', preset: 'budget', goal: 'best value-for-money entry build' },
  { label: 'Gaming', value: '1800', preset: 'gaming', goal: 'high-performance gaming rig' },
  { label: 'Workstation', value: '3500', preset: 'workstation', goal: 'pro rendering & video workstation' },
  { label: 'Extreme', value: '5000', preset: 'extreme', goal: 'flagship, no compromises' },
];

const iconMap = {
  "cpu": <Cpu size={18} />,
  "gpu": <Gamepad2 size={18} />,
  "storage": <HardDrive size={18} />,
  "ram": <MemoryStick size={18} />,
  "motherboard": <Layout size={18} />,
  "case": <Box size={18} />,
  "cooling": <Wind size={18} />,
  "psu": <Zap size={18} />,
};

const Questions = () => {
  const [budget, setBudget] = useState('1800');
  const [preset, setPreset] = useState('gaming');
  const [exporting, setExporting] = useState(false);
  const [build, setBuild] = useState(null);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setExporting(true);
    await exportToPDF('curated-build-result', `Curated-Build-${build.total}.pdf`);
    setExporting(false);
  };

  const handleCurate = () => {
    const value = Number(budget);
    if (!value || value < 600) {
      setBuild(null);
      setError("A curated build needs a budget of at least $600.");
      return;
    }
    setError(null);
    setBuild(composeBuild(preset, value));
  };

  return (
    <div className="max-w-2xl mx-auto p-10 glass-panel rounded-[2.5rem] border-ink/5 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
      
      <div className="mb-10 text-center md:text-left relative z-10">
        <h2 className="font-display font-medium text-4xl text-ink flex items-center justify-center md:justify-start gap-3">
          <span className="bg-burgundy text-white px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
            <Gem size={13} /> Curated
          </span>
          Build Concierge
        </h2>
        <p className="text-ink-soft font-normal mt-3">A rule-based engine that picks every part to your intent — instant, no guesswork.</p>
        
        <div className="mt-9 flex flex-wrap gap-2 mb-5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setBudget(p.value);
                setPreset(p.preset);
              }}
              className={`px-5 py-2 rounded-full font-mono text-[10px] uppercase tracking-[0.25em] transition-all ${
                preset === p.preset 
                  ? 'bg-ink text-ivory' 
                  : 'bg-white text-ink/45 border border-ink/15 hover:border-ink/40 hover:text-ink'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-display text-2xl text-ink/40 group-focus-within:text-burgundy transition-colors">$</span>
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-ink/15 rounded-full focus:border-burgundy outline-none font-display font-medium text-2xl text-ink transition-colors shadow-sm group-hover:border-ink/30"
              placeholder="Enter budget"
              aria-label="Budget in USD"
            />
          </div>
          <button 
            onClick={handleCurate}
            className="bg-burgundy hover:bg-burgundy-deep text-white px-10 py-4 rounded-full font-medium text-base transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Gem size={18} />
            Curate Build
          </button>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 flex items-start gap-3 text-burgundy text-sm font-medium bg-burgundy-tint p-5 rounded-2xl border border-burgundy/10"
            >
              <AlertCircle size={20} className="shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {build && (
          <motion.div 
            key="build-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fade-up"
          >
            <div id="curated-build-result" className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-luxury-card mb-6">
              <div className="bg-ink px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gem size={14} className="text-gold" />
                  <span className="text-ivory/50 font-mono text-[10px] font-medium uppercase tracking-[0.3em]">Curated Specification 2026</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
              </div>
              
              <div className="divide-y divide-ink/5">
                {build.items.map((item) => (
                  <div key={item.category} className="p-5 flex items-center gap-5 hover:bg-ivory/50 transition-colors group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f0ece2] flex items-center justify-center shrink-0 border border-ink/5">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <span className="text-burgundy">{iconMap[item.category]}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-[9px] font-medium text-ink/40 uppercase tracking-[0.25em] mb-1">{item.label}</p>
                      <p className="text-ink font-medium text-sm leading-tight">{item.name}</p>
                      <p className="text-ink/45 text-[11px] mt-0.5">{item.rationale}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-medium text-lg text-ink">${item.price}</p>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-mono text-[8px] font-medium uppercase tracking-[0.2em] text-burgundy hover:text-burgundy-deep"
                      >
                        {item.vendor}
                      </a>
                    </div>
                    <ArrowRight size={14} className="text-ink/15 group-hover:text-gold transition-colors" />
                  </div>
                ))}
              </div>
              
              <div className="px-8 py-5 bg-ivory/70 flex justify-between items-center border-t border-ink/5">
                <div>
                  <span className="font-mono text-[9px] text-ink/40 font-medium uppercase tracking-[0.25em] block">Total Investment</span>
                  <span className="font-mono text-[9px] text-ink/30 font-medium uppercase tracking-[0.25em] mt-1 block">Requires {build.requiredPsu}W supply</span>
                </div>
                <span className="font-display font-medium text-2xl text-burgundy">${build.total}</span>
              </div>
              {build.overBudget && (
                <div className="px-8 py-3 bg-gold/10 border-t border-gold/30">
                  <p className="font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-ink/60">
                    Slightly over budget by ${build.overBudgetBy} — every part is already at its minimum tier.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleExport}
                disabled={exporting}
                className="flex-1 bg-ink hover:bg-black text-ivory py-4 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {exporting ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
                {exporting ? 'Generating PDF...' : 'Download Build Specs (PDF)'}
              </button>
              <Checkout 
                amount={build.total} 
                label="Support Project"
                className="flex-1 bg-burgundy hover:bg-burgundy-deep text-white py-4 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Questions;
