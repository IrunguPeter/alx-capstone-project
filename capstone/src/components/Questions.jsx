import { useState } from 'react';

const Questions = () => {
  const [budget, setBudget] = useState('1500');
  const [loading, setLoading] = useState(false);
  const [build, setBuild] = useState(null);
  const [error, setError] = useState(null);

  const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
      Generate a balanced PC build for a budget of $${budget}.
      
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
      
      if (rawText.startsWith('```json')) {
        rawText = rawText.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```/, '').replace(/```$/, '').trim();
      }

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

  return (
    <div className="max-w-2xl mx-auto p-10 glass-panel rounded-[2.5rem] fade-up border-white">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 flex items-center justify-center md:justify-start gap-3">
          <span className="text-indigo-600">AI</span> Architect
        </h2>
        <p className="text-slate-500 font-medium mt-2">Neural-optimized part selection engine.</p>
        
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-600 font-black text-lg group-focus-within:text-indigo-500 transition-colors">$</span>
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
              <>
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : 'Generate Build'}
          </button>
        </div>
        {error && <p className="mt-6 text-red-600 text-sm font-bold bg-red-50 p-4 rounded-2xl border border-red-100">{error}</p>}
      </div>

      {build && (
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-indigo-100/20 fade-up">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5">Subsystem</th>
                <th className="px-8 py-5">Optimized Component</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {Object.entries(build).map(([key, value]) => (
                <tr key={key} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-5 font-black text-indigo-600 text-sm group-hover:text-indigo-700 transition-colors">{key}</td>
                  <td className="px-8 py-5 font-bold text-sm">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-8 py-4 bg-indigo-50/50 text-[9px] text-indigo-400 font-black uppercase tracking-widest flex justify-between items-center border-t border-slate-50">
            <span>Market Simulation: Feb 2026</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Neural Network Active
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;