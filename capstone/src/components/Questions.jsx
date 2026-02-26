import { useState } from 'react';

const Questions = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const API_KEY = "AIzaSyB0uLCaMNi_s1G2xp7gJlL0n_ObsXtspPY";
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;

    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await res.json();
      
      // The crucial path for Gemini responses
      const text = data.candidates[0].content.parts[0].text;
      setResponse(text);
    } catch (error) {
      console.error("Error fetching Gemini:", error);
      setResponse("Failed to get build advice. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <textarea 
        className="border p-2 w-full"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask for your $1500 PC build..."
      />
      <button 
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 mt-2"
        disabled={loading}
      >
        {loading ? 'Thinking...' : 'Get Build Advice'}
      </button>
      
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
};

export default Questions;