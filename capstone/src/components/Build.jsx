import { useState } from 'react';
import hardwareData from '../data/hardware.json';

function Build() {
    const [currentStep, setCurrentStep] = useState(0); 
    const [selections, setSelections] = useState({
        os: null,
        hardware: null,
        cpu: null,
        gpu: null,
        ram: null,
        storage: null,
        charger: null,
        totalPrice: 0
    });

    const isMac = selections.os?.name === 'MacOS';

    const handleSelect = (category, item) => {
        setSelections(prev => ({
            ...prev,
            [category]: item,
            totalPrice: prev.totalPrice + (item.price || 0)
        }));
        
        // Logical branching based on OS and current step
        if (category === 'os') {
            if (item.name === 'MacOS') {
                setCurrentStep(2); // Go to Mac Hardware selection
            } else {
                setCurrentStep(3); // Go to PC CPU selection
            }
        } else if (category === 'hardware') {
            setCurrentStep(4); // Go to CPU
        } else if (category === 'cpu') {
            if (isMac) {
                setCurrentStep(6); // Skip GPU for Mac, go to RAM
            } else {
                setCurrentStep(5); // Go to GPU for PC
            }
        } else if (category === 'gpu') {
            setCurrentStep(6); // Go to RAM
        } else if (category === 'ram') {
            setCurrentStep(7); // Go to Storage
        } else if (category === 'storage') {
            if (isMac && selections.hardware?.name.includes('MacBook')) {
                setCurrentStep(8); //Charger for MacBooks
            } else {
                setCurrentStep(9);
            }
        } else if (category === 'charger') {
            setCurrentStep(9);
        }
    };

    const resetBuild = () => {
        setCurrentStep(0);
        setSelections({
            os: null,
            hardware: null,
            cpu: null,
            gpu: null,
            ram: null,
            storage: null,
            charger: null,
            totalPrice: 0
        });
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100 text-center">
            
            {currentStep === 0 && (
                <div className="py-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Build your own PC</h1>
                    <p className="text-gray-500 mb-8">Let's find the perfect parts for your budget.</p>
                    <button 
                        onClick={() => setCurrentStep(1)}
                        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
                    >
                        Start Manual Build
                    </button>
                </div>
            )}

            {/* Step 1: OS */}
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

            {/* Step 2: Mac Hardware Selection */}
            {currentStep === 2 && (
                <div>
                    <h2 className="text-xl font-bold mb-6">Select Mac Hardware</h2>
                    <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto p-2">
                        {Object.entries(hardwareData.mac_hardware).map(([category, items]) => (
                            <div key={category} className="mb-4">
                                <h3 className="text-left text-sm font-bold text-gray-400 uppercase mb-2">{category}</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {items.map(item => (
                                        <button 
                                            key={item.name} 
                                            onClick={() => handleSelect('hardware', item)} 
                                            className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50"
                                        >
                                            <span>{item.name}</span>
                                            <span className="font-bold text-blue-600">${item.price}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3 & 4: CPU Selection */}
            {(currentStep === 3 || currentStep === 4) && (
                <div>
                    <h2 className="text-xl font-bold mb-6">Choose your Processor</h2>
                    <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto p-2">
                        {(isMac ? hardwareData.CPU["Apple Silicon"] : [...hardwareData.CPU.Intel, ...hardwareData.CPU.AMD]).map(item => (
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

            {/* Step 5: GPU (PC Only) */}
            {currentStep === 5 && (
                <div>
                    <h2 className="text-xl font-bold mb-2">Graphics Card (GPU)</h2>
                    <p className="text-sm text-gray-500 mb-6">Dedicated graphics for your PC build</p>
                    <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto pr-2">
                        {[...hardwareData.GPU.NVIDIA, ...hardwareData.GPU.AMD, ...hardwareData.GPU.Intel].map(item => (
                            <button 
                                key={item.name} 
                                onClick={() => handleSelect('gpu', item)} 
                                className="p-3 text-sm border rounded-lg hover:border-blue-400 text-left flex justify-between items-center"
                            >
                                <span>{item.name}</span>
                                <span className="text-blue-600 font-bold">${item.price}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 6: RAM */}
            {currentStep === 6 && (
                <div>
                    <h2 className="text-xl font-bold mb-6">Select RAM Capacity</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {(isMac ? hardwareData.ram.mac : hardwareData.ram.pc).map(item => (
                            <button 
                                key={item.size} 
                                onClick={() => handleSelect('ram', item)} 
                                className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50"
                            >
                                <span>{item.size}</span>
                                <span className="font-bold text-blue-600">${item.price}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 7: Storage */}
            {currentStep === 7 && (
                <div>
                    <h2 className="text-xl font-bold mb-6">Select Storage</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {hardwareData.storage.map(item => (
                            <button 
                                key={item.size} 
                                onClick={() => handleSelect('storage', item)} 
                                className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50"
                            >
                                <span>{item.size}</span>
                                <span className="font-bold text-blue-600">${item.price}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 8: Charger (MacBook Only) */}
            {currentStep === 8 && (
                <div>
                    <h2 className="text-xl font-bold mb-6">Select Power Adapter</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {hardwareData.chargers.map(item => (
                            <button 
                                key={item.name} 
                                onClick={() => handleSelect('charger', item)} 
                                className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50"
                            >
                                <span>{item.name}</span>
                                <span className="font-bold text-blue-600">${item.price}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 9: Summary */}
            {currentStep === 9 && (
                <div className="py-6">
                    <h2 className="text-2xl font-bold mb-6 text-green-600">Build Complete!</h2>
                    <div className="text-left bg-gray-50 p-6 rounded-2xl mb-8">
                        <div className="space-y-2">
                            <p><strong>OS:</strong> {selections.os?.name}</p>
                            {selections.hardware && <p><strong>Hardware:</strong> {selections.hardware.name}</p>}
                            <p><strong>CPU:</strong> {selections.cpu?.name}</p>
                            {selections.gpu && <p><strong>GPU:</strong> {selections.gpu.name}</p>}
                            <p><strong>RAM:</strong> {selections.ram?.size}</p>
                            <p><strong>Storage:</strong> {selections.storage?.size}</p>
                            {selections.charger && <p><strong>Charger:</strong> {selections.charger.name}</p>}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-3xl font-black text-blue-600">Total: ${selections.totalPrice}</p>
                        </div>
                    </div>
                    <button 
                        onClick={resetBuild}
                        className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
                    >
                        Start New Build
                    </button>
                </div>
            )}

            {/* Progress & Price Tracker */}
            {currentStep > 0 && currentStep < 9 && (
                <div className="mt-10 pt-6 border-t flex justify-between items-center text-sm">
                    <button 
                        onClick={() => {
                            // Simple back logic
                            if (currentStep === 2 || currentStep === 3) setCurrentStep(1);
                            else if (currentStep === 4) setCurrentStep(2);
                            else if (currentStep === 5) setCurrentStep(4);
                            else if (currentStep === 6) setCurrentStep(isMac ? 4 : 5);
                            else if (currentStep === 7) setCurrentStep(6);
                            else if (currentStep === 8) setCurrentStep(7);
                            else setCurrentStep(prev => prev - 1);
                        }} 
                        className="text-gray-400 hover:text-black"
                    >
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