import { useState } from 'react';
import hardwareData from '../data/hardware.json';

const Build = () => {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    os: null,
    cpu: null,
    gpu: null,
    ram: null,
    storageType: null,
    storageCapacity: null,
    psu: null,
    cooling: null,
    case: null,
  });

  // Helper to update build and move to next step
  const updateBuild = (key, item) => {
    setSelections((prev) => ({ ...prev, [key]: item }));
    setStep((prev) => prev + 1);
  };

  // Logic to calculate total price based on JSON attributes
  const calculateTotal = () => {
    return Object.values(selections).reduce((acc, curr) => acc + (curr?.price || 0), 0);
  };

  const resetBuild = () => {
    setStep(0);
    setSelections({ os: null, cpu: null, gpu: null, ram: null, storageType: null, storageCapacity: null, psu: null, cooling: null, case: null });
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100 font-sans">
      
      {/* Header & Price Tracker */}
      <div className="flex justify-between items-end border-b pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Build Your Own</h1>
          <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mt-1">
            {step > 0 && step < 9 ? `Step ${step} of 8: ${getStepTitle(step)}` : "Configuration Portal"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-bold uppercase">Estimated Total</p>
          <p className="text-4xl font-black text-blue-600">${calculateTotal()}</p>
        </div>
      </div>

      {/* STEP 0: Introduction */}
      {step === 0 && (
        <div className="text-center py-12">
          <div className="mb-6 inline-block p-4 bg-blue-50 rounded-full text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Ready to build your 2026 Dream Rig?</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">We'll guide you through compatibility and pricing for the latest hardware, including RTX 50-series and M5 chips.</p>
          <button onClick={() => setStep(1)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all hover:shadow-lg active:scale-95">
            Start Manual Build
          </button>
        </div>
      )}

      {/* STEP 1: OS Selection */}
      {step === 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {hardwareData.os.map((item) => (
            <button key={item.name} onClick={() => updateBuild('os', item)} className="group p-6 border-2 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
              <p className="font-bold text-gray-800">{item.name}</p>
              <p className="text-blue-600 text-sm font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">+${item.price}</p>
            </button>
          ))}
        </div>
      )}

      {/* STEP 2: CPU (Contextual Logic) */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {selections.os?.name === "MacOS" ? 
            hardwareData.CPU["Apple Silicon"].map(item => (
              <button key={item.name} onClick={() => updateBuild('cpu', item)} className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50">
                <span className="font-bold">{item.name}</span> <span className="text-blue-600">${item.price}</span>
              </button>
            )) :
            [...hardwareData.CPU.Intel, ...hardwareData.CPU.AMD, ...hardwareData.CPU.Snapdragon].map(item => (
              <button key={item.name} onClick={() => updateBuild('cpu', item)} className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50">
                <span className="font-bold">{item.name}</span> <span className="text-blue-600">${item.price}</span>
              </button>
            ))
          }
        </div>
      )}

      {/* STEP 3: GPU (Logic: MacOS Skips) */}
      {step === 3 && (
        <div>
          {selections.os?.name === "MacOS" ? (
            <div className="bg-blue-50 p-8 rounded-2xl text-center">
              <p className="text-blue-800 font-medium mb-4">MacOS utilizes high-performance integrated graphics built directly into the Apple Silicon chip.</p>
              <button onClick={() => setStep(4)} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Skip to RAM</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {[...hardwareData.GPU.NVIDIA.RTX, ...hardwareData.GPU.AMD, ...hardwareData.GPU.Intel].map(item => (
                <button key={item.name} onClick={() => updateBuild('gpu', item)} className="p-3 border rounded-lg text-xs font-bold hover:border-blue-500 hover:text-blue-600 transition-colors flex flex-col">
                  {item.name} <span className="text-gray-400 font-normal mt-1">${item.price}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 4: RAM */}
      {step === 4 && (
        <div className="grid grid-cols-2 gap-4">
          {hardwareData.ram.capacity.map(item => (
            <button key={item.size} onClick={() => updateBuild('ram', item)} className="p-6 border-2 rounded-2xl text-center group hover:border-blue-500">
              <span className="text-2xl font-black block">{item.size}</span>
              <span className="text-blue-600 font-bold group-hover:scale-110 transition-transform block mt-2">${item.price}</span>
            </button>
          ))}
        </div>
      )}

      {/* STEP 5: Storage (Sub-Selection Logic) */}
      {step === 5 && (
        <div className="space-y-4">
          {!selections.storageType ? (
            <div className="grid grid-cols-3 gap-4">
              {hardwareData.storage.types.map(type => (
                <button key={type.name} onClick={() => setSelections(prev => ({...prev, storageType: type}))} className="p-4 border rounded-xl hover:bg-gray-50">
                  <span className="font-bold">{type.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2">
              {hardwareData.storage.capacities.map(cap => (
                <button 
                    key={cap.size} 
                    onClick={() => updateBuild('storageCapacity', cap)} 
                    className="p-4 border-2 border-blue-50 rounded-xl hover:border-blue-500"
                >
                  <span className="font-bold">{cap.size}</span>
                  <span className="block text-blue-600">${cap.price + selections.storageType.price}</span>
                </button>
              ))}
              <button onClick={() => setSelections(prev => ({...prev, storageType: null}))} className="col-span-3 text-xs text-gray-400 hover:text-gray-600 mt-4">← Change Drive Type</button>
            </div>
          )}
        </div>
      )}

      {/* STEP 6: Cooling */}
      {step === 6 && (
        <div className="grid grid-cols-2 gap-4">
          {[...hardwareData.cooling.Air, ...hardwareData.cooling.Liquid].map(item => (
            <button key={item.name} onClick={() => updateBuild('cooling', item)} className="p-5 border rounded-2xl hover:bg-blue-50 text-left">
              <p className="font-bold">{item.name}</p>
              <p className="text-blue-600 font-bold mt-1">${item.price}</p>
            </button>
          ))}
        </div>
      )}

      {/* STEP 7: Case Selection */}
      {step === 7 && (
        <div className="grid grid-cols-2 gap-4">
          {hardwareData.caseSize.map(name => (
            <button key={name} onClick={() => updateBuild('case', {name, price: 80})} className="p-5 border rounded-2xl hover:bg-gray-50 text-center font-bold">
              {name}
            </button>
          ))}
        </div>
      )}

      {/* STEP 8: Final Summary */}
      {step === 8 && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="bg-gray-50 rounded-3xl p-6">
            <h2 className="text-xl font-black mb-4">BUILD MANIFEST</h2>
            <div className="space-y-3">
              <SummaryRow label="OS" val={selections.os?.name} />
              <SummaryRow label="Processor" val={selections.cpu?.name} />
              <SummaryRow label="Graphics" val={selections.gpu?.name || "Integrated"} />
              <SummaryRow label="Memory" val={selections.ram?.size} />
              <SummaryRow label="Storage" val={`${selections.storageType?.name} ${selections.storageCapacity?.size}`} />
              <SummaryRow label="Cooling" val={selections.cooling?.name} />
              <SummaryRow label="Chassis" val={selections.case?.name} />
            </div>
          </div>
          <button onClick={resetBuild} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-colors">Create New Build</button>
        </div>
      )}

      {/* Navigation Footer */}
      {step > 0 && (
        <div className="mt-8 pt-6 border-t flex items-center justify-between">
          <button onClick={() => setStep(step - 1)} className="text-gray-400 font-bold hover:text-black transition-colors">
            ← PREVIOUS STEP
          </button>
          <div className="flex gap-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full ${i < step ? 'bg-blue-600' : 'bg-gray-100'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components for cleaner UI
const SummaryRow = ({ label, val }) => (
  <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
    <span className="text-gray-400 font-medium uppercase tracking-tighter">{label}</span>
    <span className="text-gray-800 font-bold">{val}</span>
  </div>
);

const getStepTitle = (step) => {
  const titles = ["", "Operating System", "Processor (CPU)", "Graphics (GPU)", "Memory (RAM)", "Storage (SSD)", "Thermal Cooling", "Chassis (Case)", "Build Summary"];
  return titles[step];
};

export default Build;