import { useState } from 'react';

const Questions = () => {
  const [budget, setBudget] = useState('1500');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');

  const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const handleGetBuild = async () => {
    setLoading(true);
    setRecommendation('');
    
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`;
      
      const prompt = `You are a professional PC hardware expert in February 2026. 
      Create a highly optimized gaming PC build for exactly $${budget}. 
      Include: CPU, GPU (Prioritize RTX 50-series or RX 9000), RAM (DDR5), Storage, Motherboard, PSU, and Case. 
      Format the response as a clean Markdown table followed by a 2-sentence explanation of why this build is the "best bang for buck" right now.`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const advice = data.candidates[0].content.parts[0].text;
      setRecommendation(advice);

    } catch (error) {
      console.error("Gemini Error:", error);
      setRecommendation("Error: Failed to get recommendation. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-slate-100 font-sans">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-2">AI Build Architect</h2>
      <p className="text-slate-500 mb-8">Generate a custom 2026 PC parts list in seconds.</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Total Budget</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400 font-bold">$</span>
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all text-lg font-semibold text-slate-700"
            />
          </div>
        </div>
        <button 
          onClick={handleGetBuild}
          disabled={loading}
          className="self-end bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Analyzing Market...' : 'Generate Build'}
        </button>
      </div>

      {recommendation && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="prose prose-indigo max-w-none bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 text-slate-700">
            {/* Using a simple pre-wrap style for Markdown text */}
            <div style={{ whiteSpace: 'pre-wrap' }}>{recommendation}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;