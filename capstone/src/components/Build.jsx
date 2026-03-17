import { useReducer, useEffect, useRef } from 'react';
import hardwareData from '../data/hardware.json';

const initialState = {
    currentStep: 0,
    selections: {
        os: null,
        hardware: null,
        cpu: null,
        gpu: null,
        ram: null,
        storage: null,
        charger: null,
    },
    totalPrice: 0,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SELECT_ITEM': {
            const { category, item } = action.payload;
            const newSelections = { ...state.selections, [category]: item };
            const newPrice = Object.values(newSelections)
                .reduce((acc, curr) => acc + (curr?.price || 0), 0);
            
            let nextStep = state.currentStep;
            const isMac = newSelections.os?.name === 'MacOS';

            if (category === 'os') {
                nextStep = item.name === 'MacOS' ? 2 : 3;
            } else if (category === 'hardware') {
                nextStep = 4;
            } else if (category === 'cpu') {
                nextStep = isMac ? 6 : 5;
            } else if (category === 'gpu') {
                nextStep = 6;
            } else if (category === 'ram') {
                nextStep = 7;
            } else if (category === 'storage') {
                const isMacBook = newSelections.hardware?.name.includes('MacBook');
                nextStep = (isMac && isMacBook) ? 8 : 9;
            } else if (category === 'charger') {
                nextStep = 9;
            }

            return {
                ...state,
                selections: newSelections,
                totalPrice: newPrice,
                currentStep: nextStep,
            };
        }
        case 'PREVIOUS_STEP': {
            let prevStep = state.currentStep - 1;
            const isMac = state.selections.os?.name === 'MacOS';

            if (state.currentStep === 2 || state.currentStep === 3) prevStep = 1;
            else if (state.currentStep === 4) prevStep = 2;
            else if (state.currentStep === 5) prevStep = 4;
            else if (state.currentStep === 6) prevStep = isMac ? 4 : 5;
            else if (state.currentStep === 7) prevStep = 6;
            else if (state.currentStep === 8) prevStep = 7;

            return { ...state, currentStep: prevStep };
        }
        case 'SET_STEP':
            return { ...state, currentStep: action.payload };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

function Build() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stepRef = useRef(null);

    const { currentStep, selections, totalPrice } = state;
    const isMac = selections.os?.name === 'MacOS';

    useEffect(() => {
        if (currentStep > 0) {
            stepRef.current?.focus();
            stepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentStep]);

    const handleSelect = (category, item) => {
        dispatch({ type: 'SELECT_ITEM', payload: { category, item } });
    };

    return (
        <div 
            className="max-w-2xl mx-auto p-10 glass-panel rounded-[2.5rem] text-center fade-up"
            role="region" 
            aria-label="PC Build Wizard"
        >
            <div ref={stepRef} tabIndex="-1" className="outline-none">
                {currentStep === 0 && (
                    <div className="py-10">
                        <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Build your own PC</h3>
                        <p className="text-slate-500 mb-10 text-lg font-medium">Let's find the perfect parts for your budget.</p>
                        <button 
                            onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
                            className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all focus:ring-4 focus:ring-indigo-100 glow-btn shadow-lg shadow-indigo-200"
                        >
                            Start Manual Build
                        </button>
                    </div>
                )}

                {/* Step 1: OS */}
                {currentStep === 1 && (
                    <div className="fade-up">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">Which Operating System?</h2>
                        <div className="grid grid-cols-2 gap-6">
                            {hardwareData.os.map((item) => (
                                <button 
                                    key={item.name}
                                    onClick={() => handleSelect('os', item)}
                                    className="p-6 bg-white border border-slate-100 rounded-2xl hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50 transition-all focus:ring-2 focus:ring-indigo-500 group"
                                >
                                    <span className="block text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</span>
                                    <span className="block text-sm text-slate-400 mt-2 font-mono font-bold">${item.price}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Mac Hardware Selection */}
                {currentStep === 2 && (
                    <div className="fade-up">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">Select Mac Hardware</h2>
                        <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                            {Object.entries(hardwareData.mac_hardware).map(([category, items]) => (
                                <div key={category} className="mb-6 last:mb-0">
                                    <h3 className="text-left text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 px-2 opacity-60">{category}</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {items.map(item => (
                                            <button 
                                                key={item.name} 
                                                onClick={() => handleSelect('hardware', item)} 
                                                className="p-5 bg-white border border-slate-100 rounded-xl flex justify-between items-center hover:border-indigo-600 hover:shadow-md transition-all"
                                            >
                                                <span className="font-bold text-slate-800">{item.name}</span>
                                                <span className="font-mono font-black text-indigo-600">${item.price}</span>
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
                    <div className="fade-up">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">Choose your Processor</h2>
                        <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                            {(isMac ? hardwareData.CPU["Apple Silicon"] : [...hardwareData.CPU.Intel, ...hardwareData.CPU.AMD]).map(item => (
                                <button 
                                    key={item.name} 
                                    onClick={() => handleSelect('cpu', item)} 
                                    className="p-5 bg-white border border-slate-100 rounded-xl flex justify-between items-center hover:border-indigo-600 transition-all"
                                >
                                    <span className="font-bold text-slate-800">{item.name}</span>
                                    <span className="font-mono font-black text-indigo-600">${item.price}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 5: GPU */}
                {currentStep === 5 && (
                    <div className="fade-up">
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Graphics Card (GPU)</h2>
                        <p className="text-sm text-slate-500 mb-8 font-medium">Dedicated graphics for your PC build</p>
                        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                            {[...hardwareData.GPU.NVIDIA, ...hardwareData.GPU.AMD, ...hardwareData.GPU.Intel].map(item => (
                                <button 
                                    key={item.name} 
                                    onClick={() => handleSelect('gpu', item)} 
                                    className="p-4 bg-white border border-slate-100 rounded-xl text-left flex justify-between items-center hover:border-indigo-600 transition-all"
                                >
                                    <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                                    <span className="text-indigo-600 font-mono font-black">${item.price}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 6: RAM */}
                {currentStep === 6 && (
                    <div className="fade-up">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">Select RAM Capacity</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {(isMac ? hardwareData.ram.mac : hardwareData.ram.pc).map(item => (
                                <button 
                                    key={item.size} 
                                    onClick={() => handleSelect('ram', item)} 
                                    className="p-6 bg-white border border-slate-100 rounded-2xl flex justify-between items-center hover:border-indigo-600 transition-all"
                                >
                                    <span className="font-bold text-slate-900 text-lg">{item.size}</span>
                                    <span className="font-mono font-black text-indigo-600">${item.price}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 7: Storage */}
                {currentStep === 7 && (
                    <div className="fade-up">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">Select Storage</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {hardwareData.storage.map(item => (
                                <button 
                                    key={item.size} 
                                    onClick={() => handleSelect('storage', item)} 
                                    className="p-6 bg-white border border-slate-100 rounded-2xl flex justify-between items-center hover:border-indigo-600 transition-all"
                                >
                                    <span className="font-bold text-slate-900 text-lg">{item.size}</span>
                                    <span className="font-mono font-black text-indigo-600">${item.price}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 8: Charger */}
                {currentStep === 8 && (
                    <div className="fade-up">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">Select Power Adapter</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {hardwareData.chargers.map(item => (
                                <button 
                                    key={item.name} 
                                    onClick={() => handleSelect('charger', item)} 
                                    className="p-6 bg-white border border-slate-100 rounded-2xl flex justify-between items-center hover:border-indigo-600 transition-all"
                                >
                                    <span className="font-bold text-slate-900">{item.name}</span>
                                    <span className="font-mono font-black text-indigo-600">${item.price}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 9: Summary */}
                {currentStep === 9 && (
                    <div className="py-6 fade-up" role="status">
                        <h2 className="text-4xl font-black mb-10 text-emerald-600 tracking-tight">Build Verified.</h2>
                        <div className="text-left bg-slate-50/50 p-8 rounded-3xl mb-10 border border-slate-100">
                            <div className="space-y-4">
                                <SummaryRow label="OS" value={selections.os?.name} />
                                {selections.hardware && <SummaryRow label="Hardware" value={selections.hardware.name} />}
                                <SummaryRow label="CPU" value={selections.cpu?.name} />
                                {selections.gpu && <SummaryRow label="GPU" value={selections.gpu.name} />}
                                <SummaryRow label="RAM" value={selections.ram?.size} />
                                <SummaryRow label="Storage" value={selections.storage?.size} />
                                {selections.charger && <SummaryRow label="Charger" value={selections.charger.name} />}
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-200">
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Total Investment</span>
                                    <p className="text-5xl font-black text-indigo-600 tracking-tighter">${totalPrice}</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => dispatch({ type: 'RESET' })}
                            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-slate-200"
                        >
                            New Configuration
                        </button>
                    </div>
                )}

                {/* Progress Tracking */}
                {currentStep > 0 && currentStep < 9 && (
                    <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                        <button 
                            onClick={() => dispatch({ type: 'PREVIOUS_STEP' })} 
                            className="text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[10px] transition-all p-2 -ml-2"
                        >
                            ← Back
                        </button>
                        <div className="text-right">
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] mb-1">Running Total</p>
                            <p className="text-3xl font-black text-indigo-600 font-mono tracking-tighter">${totalPrice}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">{label}</span>
            <span className="text-slate-900 font-bold text-right">{value}</span>
        </div>
    );
}

export default Build;