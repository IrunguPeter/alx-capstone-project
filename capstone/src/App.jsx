import Header from './components/Header';
import Navbar from './components/Navbar';
import Questions from './components/Questions';



function App() {
  const WORKFLOW_DATA = {
    gaming: { icon: '🎮', label: 'Gaming', description: 'High FPS and low latency.' },
    ai: { icon: '🤖', label: 'AI', description: 'Deep learning and model training.' },
    videoEditing: { icon: '🎬', label: 'Video Editing', description: 'Smooth rendering and editing.' },
    generalUse: { icon: '💻', label: 'General Use', description: 'Balanced performance for everyday tasks.' },
    Modeling: { icon: '🖌️', label: '3D Modeling', description: 'Powerful GPU for rendering.' },
  };

  const Question = (WORKFLOW_DATA) => {
    // Handle question logic here
  };
  return (
    <div className="App">
      <Navbar />
      <Header />

      <div className="p-9 bg-white shadow-xl rounded-2xl border border-blue-200">
        <h1 className="text-2xl font-bold text-blue-600">We Help you choose the best PC parts for your build</h1>
        <a href="#" target="blank"><button type="submit" onClick={Question} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mt-5">
          <p className="text-white-600 mt-2 font-bold shadow-md hover:bg-blue-700">Get Started</p>
        </button>
        </a>
      </div>
      <div className="bg:white rounded overflow-hidden shadow-md mt-10">
        <img src="Img/1.jpg" alt="GamingPC Picture"/>
        <div>
          <Questions/>
        </div>
      </div>
    </div>
  );
};
export default App