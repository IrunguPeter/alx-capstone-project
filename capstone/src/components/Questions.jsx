import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Terminal, 
  AlertCircle, 
  Cpu, 
  Gamepad2, 
  HardDrive, 
  MemoryStick, 
  Layout, 
  Box, 
  Zap,
  ArrowRight,
  Loader2,
  FileDown
} from 'lucide-react';
import { exportToPDF } from '../utils/pdfExport';

const Questions = () => {
  const [budget, setBudget] = useState('1500');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [build, setBuild] = useState(null);
  const [error, setError] = useState(null);
  const [goal, setGoal] = useState('a balanced build');

  const PRESETS = [
    { label: 'Budget', value: '800', goal: 'the best value-for-money entry-level gaming build' },
    { label: 'Gaming', value: '1800', goal: 'a high-performance 4K gaming build' },
    { label: 'Workstation', value: '3500', goal: 'a professional workstation for 3D rendering and video editing' },
    { label: 'Extreme', value: '5000', goal: 'an absolute flagship build with no compromises' },
  ];

  const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const handleExport = async () => {
    setExporting(true);
    await exportToPDF('ai-build-result', `AI-Architect-Build-${budget}.pdf`);
    setExporting(false);
  };

  const handleGetBuild = async () => {
    if (!GEMINI_KEY) {
      setError("API Key is missing! Please configure VITE_GEMINI_API_KEY in your .env file.");
      return;
    }

    setLoading(true);
    setBuild(null);
    setError(null);
    
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`;
      
      const prompt = `You are a PC building expert in the year 2026. 
      Generate ${goal} for a budget of $${budget}.
      
      Return ONLY a JSON object with these EXACT keys:
      "CPU", "GPU", "SSD", "RAM", "Motherboard", "Case", "Powersupply Unit".
      
      The values should be a string containing the part name and its estimated 2026 price in parentheses, e.g., "Intel Core i7-16700K ($350)".
      
      Ensure the total price is close to $${budget}.
      Do not include any Markdown formatting, backticks, or extra text. Just the raw JSON.`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error("The AI didn't return a valid response. Please try again.");
      }

      let rawText = data.candidates[0].content.parts[0].text.trim();
      
      try {
        const parsedBuild = JSON.parse(rawText);
        setBuild(parsedBuild);
      } catch {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          setBuild(JSON.parse(jsonMatch[0]));
        } else {
          throw new Error("The AI returned an invalid format. Please try again.");
        }
      }

    } catch (err) {
      console.error("Build Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  
  };

  const iconMap = {
    "CPU": <Cpu size={18} />,
    "GPU": <Gamepad2 size={18} />,
    "SSD": <HardDrive size={18} />,
    "RAM": <MemoryStick size={18} />,
    "Motherboard": <Layout size={18} />,
    "Case": <Box size={18} />,
    "Powersupply Unit": <Zap size={18} />,
  };

  return (
    <div className="max-w-2xl mx-auto p-10 glass-panel rounded-[2.5rem] border-white relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
      
      <div className="mb-10 text-center md:text-left relative z-10">
        <h2 className="text-3xl font-black text-slate-900 flex items-center justify-center md:justify-start gap-3">
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-sm font-black tracking-widest uppercase">AI</span> 
          Architect
        </h2>
        <p className="text-slate-500 font-medium mt-2">Neural-optimized part selection engine.</p>
        
        <div className="mt-8 flex flex-wrap gap-2 mb-4">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setBudget(p.value);
                setGoal(p.goal);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                budget === p.value 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-600 font-black text-lg group-focus-within:text-indigo-400 transition-colors">$</span>
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)}
              className="w-full pl-10 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-black text-xl text-slate-900 transition-all shadow-sm group-hover:bg-slate-100/50"
              placeholder="Enter budget"
              aria-label="Budget in USD"
            />
          </div>
          <button 
            onClick={handleGetBuild}
            disabled={loading}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 glow-btn shadow-lg shadow-indigo-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Sparkles size={20} />
            )}
            {loading ? 'Processing...' : 'Generate Build'}
          </button>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 flex items-start gap-3 text-red-600 text-sm font-bold bg-red-50 p-5 rounded-2xl border border-red-100"
            >
              <AlertCircle size={20} className="shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-50 bg-slate-50/50 animate-pulse">
                <div className="w-6 h-6 bg-slate-200 rounded-md" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : build ? (
          <motion.div 
            key="build-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fade-up"
          >
            <div id="ai-build-result" className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl shadow-indigo-100/20 mb-6">
              <div className="bg-slate-900 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-emerald-400" />
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Compiled Specs 2026</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              
              <div className="divide-y divide-slate-50">
                {Object.entries(build).map(([key, value]) => (
                  <div key={key} className="p-5 flex items-center gap-5 hover:bg-slate-50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      {iconMap[key] || <Box size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{key}</p>
                      <p className="text-slate-900 font-bold text-sm leading-tight">{value}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-200 group-hover:text-indigo-300 transition-colors" />
                  </div>
                ))}
              </div>
              
              <div className="px-8 py-5 bg-indigo-50/30 flex justify-between items-center border-t border-slate-50">
                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Target Budget Match</span>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-black tracking-tighter">${budget}</span>
              </div>
            </div>

            <button 
              onClick={handleExport}
              disabled={exporting}
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-slate-200"
            >
              {exporting ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
              {exporting ? 'Generating PDF...' : 'Download Build Specs (PDF)'}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Questions;