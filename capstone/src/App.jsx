import Header from './components/Header';
import Navbar from './components/Navbar';
function App() {
  return (
    <div className="App">
      <Navbar />
      <Header />

      <div className="p-8 bg-white shadow-xl rounded-2xl border border-blue-200">
        <h1 className="text-2xl font-bold text-blue-600">We Help you choose the best PC parts for your build</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mt-4">
          <p className="text-gray-600 mt-2 font-bold">Get Started</p>
        </button>
      </div>
    </div>
  )
}
export default App