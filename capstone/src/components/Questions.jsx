import { useState } from 'react';

const Questions = () => {
  const [budget, setBudget] = useState('1500');
  const [loading, setLoading] = useState(false);
  const [build, setBuild] = useState(null);

  const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const handleGetBuild = async () => {
    setLoading(true);
    setBuild(null);
    
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`;
      
      // We ask Gemini to return ONLY a JSON object for easy parsing
      const prompt = `Return a JSON object for a $${budget} PC build in Feb 2026. 
      Use exactly these keys: "CPU", "GPU", "SSD", "RAM", "Motherboard", "Case", "Powersupply Unit".
      Values should be the specific part name and its estimated 2026 price in brackets.`;


      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text;
      
      // Clean the string in case Gemini adds markdown code blocks
      const cleanJson = rawText.replace(/```json|```/g, "").trim();
      setBuild(JSON.parse(cleanJson));

    } catch (error) {
      console.error("Build Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-2xl rounded-3xl border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">PC Part Picker AI</h2>
        <div className="mt-4 flex gap-2">
          <input 
            type="number" 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)}
            className="flex-1 p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none font-bold"
          />
          <button 
            onClick={handleGetBuild}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            {loading ? 'Building...' : 'Generate'}
          </button>
        </div>
      </div>

      {build && (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Component</th>
                <th className="px-6 py-4 font-semibold">Recommended Part & Est. Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {Object.entries(build).map(([key, value]) => (
                <tr key={key} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-blue-600">{key}</td>
                  <td className="px-6 py-4">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-blue-50 text-xs text-blue-800 italic">
            *Prices reflect February 2026 market trends (RTX 5070 / Ryzen 9000).
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;