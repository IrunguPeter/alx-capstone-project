import { useState } from 'react'; // Added state
import Header from './components/Header';
import Navbar from './components/Navbar';
import Questions from './components/Questions';

function App() {
  // 1. Add state to toggle the visibility of the questions
  const [showQuestions, setShowQuestions] = useState(false);

  const WORKFLOW_DATA = {
    gaming: { icon: '🎮', label: 'Gaming', description: 'High FPS and low latency.' },
    ai: { icon: '🤖', label: 'AI', description: 'Deep learning and model training.' },
    videoEditing: { icon: '🎬', label: 'Video Editing', description: 'Smooth rendering and editing.' },
    generalUse: { icon: '💻', label: 'General Use', description: 'Balanced performance for everyday tasks.' },
    Modeling: { icon: '🖌️', label: '3D Modeling', description: 'Powerful GPU for rendering.' },
  };

  // 2. This function now toggles the view
  const handleStart = () => {
    setShowQuestions(true);
  };

  return (
    <div className="App">
      <Navbar />
      <Header />

      <div className="p-9 bg-white shadow-xl rounded-2xl border border-blue-200 m-5">
        <h1 className="text-2xl font-bold text-blue-600">We Help you choose the best PC parts for your build</h1>
        
        {/* Removed the <a> tag to prevent page jumps */}
        <button 
          type="button" 
          onClick={handleStart} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded mt-5 shadow-md transition-all"
        >
          Get Started
        </button>
      </div>

      {/* 3. Only show the Questions component after clicking 'Get Started' */}
      {showQuestions && (
        <div className="bg-white rounded overflow-hidden shadow-md mt-10 p-5">
          <img src="./assets/react.svg" alt="GamingPC Picture" className="w-20 mb-4"/>
          <div>
            {/* Pass the WORKFLOW_DATA if your Questions component needs it */}
            <Questions workflows={WORKFLOW_DATA} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;