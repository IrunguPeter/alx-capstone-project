import { useState } from 'react';
import hardwareData from '../data/hardware.json';

function Build() {
    const [currentStep, setCurrentStep] = useState(0); 
    const [selections, setSelections] = useState({
        os: null,
        cpu: null,
        gpu: null,
        ram: null,
        storage: null,
        totalPrice: 0
    });

    // Helper to advance steps and track cost
    const handleSelect = (category, item) => {
        setSelections(prev => ({
            ...prev,
            [category]: item,
            totalPrice: prev.totalPrice + (item.price || 0)
        }));
        
        // LOGIC: If MacOS is picked, skip the GPU selection step 
        // because it uses Integrated Apple Silicon graphics.
        if (category === 'os' && item.name === 'MacOS') {
            setCurrentStep(3); // Skip straight to RAM
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100 text-center">
            
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
                <div className="py-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">PC Architect 2026</h1>
                    <p className="text-gray-500 mb-8">Let's find the perfect parts for your budget.</p>
                    <button 
                        onClick={() => setCurrentStep(1)}
                        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
                    >
                        Start Manual Build
                    </button>
                </div>
            )}

            {/* Step 1: OS Selection */}
            {currentStep === 1 && (
                <div>
                    <h2 className="text-xl font-bold mb-6">Which Operating System?</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {hardwareData.os.map((item) => (
                            <button 
                                key={item.name}
                                onClick={() => handleSelect('os', item)}
                                className="p-4 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 font-medium"
                            >
                                {item.name} <span className="block text-sm text-gray-400">${item.price}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: CPU Branching */}
            {currentStep === 2 && (
                <div>
                    <h2 className="text-xl font-bold mb-6">Choose your Processor</h2>
                    <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto p-2">
                        {/* If Windows/Linux, show Intel, AMD, and Snapdragon */}
                        {[...hardwareData.CPU.Intel, ...hardwareData.CPU.AMD, ...hardwareData.CPU.Snapdragon].map(item => (
                            <button 
                                key={item.name} 
                                onClick={() => handleSelect('cpu', item)} 
                                className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50"
                            >
                                <span>{item.name}</span>
                                <span className="font-bold text-blue-600">${item.price}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3: GPU Logic (The Massive List) */}
            {currentStep === 3 && (
                <div>
                    <h2 className="text-xl font-bold mb-2">Graphics Card (GPU)</h2>
                    <p className="text-sm text-gray-500 mb-6">Scroll to see 2026 NVIDIA RTX 50-series options</p>
                    <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
                        {/* Combining all NVIDIA, AMD, and Intel GPUs from your JSON */}
                        {[...hardwareData.GPU.NVIDIA.RTX, ...hardwareData.GPU.AMD, ...hardwareData.GPU.Intel].map(item => (
                            <button 
                                key={item.name} 
                                onClick={() => handleSelect('gpu', item)} 
                                className="p-3 text-sm border rounded-lg hover:border-blue-400 text-left flex justify-between"
                            >
                                <span>{item.name}</span>
                                <span className="text-blue-600">${item.price}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Progress & Price Tracker */}
            {currentStep > 0 && (
                <div className="mt-10 pt-6 border-t flex justify-between items-center text-sm">
                    <button onClick={() => setCurrentStep(currentStep - 1)} className="text-gray-400 hover:text-black">
                        ← Back
                    </button>
                    <div className="text-right">
                        <p className="text-gray-400">Current Total</p>
                        <p className="text-2xl font-black text-blue-600">${selections.totalPrice}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Build;