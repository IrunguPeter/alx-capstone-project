import { useReducer, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Monitor, 
  Gamepad2, 
  MemoryStick, 
  HardDrive, 
  Zap, 
  CheckCircle2, 
  ChevronLeft,
  Laptop,
  Layout,
  Box,
  Wind,
  FileDown,
  Loader2
} from 'lucide-react';
import hardwareData from '../data/hardware.json';
import { exportToPDF } from '../utils/pdfExport';

const initialState = {
    currentStep: 0,
    selections: {
        os: null,
        hardware: null,
        cpu: null,
        motherboard: null,
        gpu: null,
        ram: null,
        storage: null,
        cooling: null,
        case: null,
        psu: null,
        charger: null,
    },
    totalPrice: 0,
};

const STEPS = [
  { id: 1, name: 'OS', icon: Monitor },
  { id: 2, name: 'Model', icon: Laptop },
  { id: 4, name: 'CPU', icon: Cpu },
  { id: 10, name: 'Board', icon: Layout },
  { id: 5, name: 'GPU', icon: Gamepad2 },
  { id: 6, name: 'RAM', icon: MemoryStick },
  { id: 7, name: 'Storage', icon: HardDrive },
  { id: 11, name: 'Cooling', icon: Wind },
  { id: 12, name: 'Case', icon: Box },
  { id: 13, name: 'Power', icon: Zap },
  { id: 8, name: 'Adapter', icon: Zap },
];

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
                nextStep = isMac ? 6 : 10;
            } else if (category === 'motherboard') {
                nextStep = 5;
            } else if (category === 'gpu') {
                nextStep = 6;
            } else if (category === 'ram') {
                nextStep = 7;
            } else if (category === 'storage') {
                const isMacBook = newSelections.hardware?.name.includes('MacBook');
                if (isMac) {
                   nextStep = isMacBook ? 8 : 100;
                } else {
                   nextStep = 11;
                }
            } else if (category === 'cooling') {
                nextStep = 12;
            } else if (category === 'case') {
                nextStep = 13;
            } else if (category === 'psu') {
                nextStep = 100;
            } else if (category === 'charger') {
                nextStep = 100;
            }

            if (nextStep === 100) nextStep = 9;

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
            else if (state.currentStep === 10) prevStep = 4;
            else if (state.currentStep === 5) prevStep = 10;
            else if (state.currentStep === 6) prevStep = isMac ? 4 : 5;
            else if (state.currentStep === 7) prevStep = 6;
            else if (state.currentStep === 11) prevStep = 7;
            else if (state.currentStep === 12) prevStep = 11;
            else if (state.currentStep === 13) prevStep = 12;
            else if (state.currentStep === 8) prevStep = 7;
            else if (state.currentStep === 9) {
                if (isMac) {
                    prevStep = state.selections.charger ? 8 : 7;
                } else {
                    prevStep = 13;
                }
            }

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

function SummaryRow({ label, value }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">{label}</span>
            <span className="text-white font-bold text-right text-sm">{value}</span>
        </div>
    );
}

function Build() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stepRef = useRef(null);
    const [exporting, setExporting] = useState(false);

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

    const handleExport = async () => {
        setExporting(true);
        await exportToPDF('manual-build-summary', `Manual-Build-${totalPrice}.pdf`);
        setExporting(false);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    };

    return (
        <div 
            className="max-w-4xl mx-auto p-4 md:p-10 glass-panel rounded-[2.5rem] text-center"
            role="region" 
            aria-label="PC Build Wizard"
        >
            {currentStep > 0 && currentStep < 9 && (
                <div className="mb-12 hidden md:flex justify-between items-center px-4 relative overflow-x-auto pb-8 custom-scrollbar">
                    <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                    {STEPS.filter(s => {
                        if (isMac) {
                           return [1, 2, 4, 6, 7, 8].includes(s.id);
                        } else {
                           return [1, 4, 10, 5, 6, 7, 11, 12, 13].includes(s.id);
                        }
                    }).map((step) => {
                        const Icon = step.icon;
                        const isCompleted = currentStep > step.id || (currentStep === 3 && step.id === 2);
                        const isActive = currentStep === step.id || (currentStep === 3 && step.id === 4);
                        
                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center px-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                    isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :
                                    isActive ? 'bg-indigo-600 text-white scale-110 shadow-xl shadow-indigo-200' :
                                    'bg-white border-2 border-slate-100 text-slate-300'
                                }`}>
                                    {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                                </div>
                                <span className={`absolute -bottom-2 text-[8px] font-black uppercase tracking-widest whitespace-nowrap ${
                                    isActive ? 'text-indigo-600' : 'text-slate-400'
                                }`}>
                                    {step.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            <div ref={stepRef} tabIndex="-1" className="outline-none min-h-[500px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                        <motion.div 
                            key="step-0"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="py-10"
                        >
                            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                                <Cpu size={40} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Precision Configurator</h3>
                            <p className="text-slate-500 mb-10 text-lg font-medium max-w-md mx-auto">Select each component with surgical precision for your next high-performance machine.</p>
                            <button 
                                onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
                                className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all focus:ring-4 focus:ring-indigo-100 glow-btn shadow-lg shadow-indigo-200"
                            >
                                Launch Wizard
                            </button>
                        </motion.div>
                    )}

                    {currentStep === 1 && (
                        <motion.div 
                            key="step-1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-8">Choose your Ecosystem</h2>
                            <div className="grid grid-cols-2 gap-6">
                                {hardwareData.os.map((item) => (
                                    <button 
                                        key={item.name}
                                        onClick={() => handleSelect('os', item)}
                                        className="p-8 bg-white border-2 border-slate-50 rounded-3xl hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-50 transition-all group relative overflow-hidden text-left"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                            {item.name === 'MacOS' ? <Laptop size={48} /> : <Monitor size={48} />}
                                        </div>
                                        <span className="block text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</span>
                                        <span className="block text-sm text-indigo-500 mt-2 font-mono font-bold">{item.price === 0 ? 'Included' : `$${item.price}`}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div 
                            key="step-2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-8">Select Base Platform</h2>
                            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto p-4 bg-slate-50/50 rounded-3xl border border-slate-100 custom-scrollbar">
                                {Object.entries(hardwareData.mac_hardware).map(([category, items]) => (
                                    <div key={category} className="mb-6 last:mb-0">
                                        <h3 className="text-left text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3 px-2 opacity-60">{category}</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {items.map(item => (
                                                <button 
                                                    key={item.name} 
                                                    onClick={() => handleSelect('hardware', item)} 
                                                    className="p-5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center hover:border-indigo-600 hover:shadow-lg transition-all"
                                                >
                                                    <span className="font-bold text-slate-800">{item.name}</span>
                                                    <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">${item.price}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {(currentStep === 3 || currentStep === 4) && (
                        <motion.div 
                            key="step-cpu"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-8">Select Processing Core</h2>
                            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto p-4 bg-slate-50/50 rounded-3xl border border-slate-100">
                                {(isMac ? hardwareData.CPU["Apple Silicon"] : [...hardwareData.CPU.Intel, ...hardwareData.CPU.AMD]).map(item => (
                                    <button 
                                        key={item.name} 
                                        onClick={() => handleSelect('cpu', item)} 
                                        className="p-6 bg-white border border-slate-100 rounded-2xl flex justify-between items-center hover:border-indigo-600 hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                <Cpu size={20} />
                                            </div>
                                            <div className="text-left">
                                                <span className="font-black text-slate-800 block">{item.name}</span>
                                                {!isMac && <span className="text-[10px] text-slate-400 font-bold uppercase">{item.socket} • {item.ramType}</span>}
                                            </div>
                                        </div>
                                        <span className="font-mono font-black text-indigo-600">${item.price}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 10 && (
                        <motion.div 
                            key="step-10"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Compatible Motherboard</h2>
                            <p className="text-sm text-slate-500 mb-8 font-medium italic">Filtered for {selections.cpu?.socket} Socket</p>
                            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto p-4 bg-slate-50/50 rounded-3xl border border-slate-100">
                                {hardwareData.Motherboard.filter(mb => mb.socket === selections.cpu?.socket).map(item => (
                                    <button 
                                        key={item.name} 
                                        onClick={() => handleSelect('motherboard', item)} 
                                        className="p-6 bg-white border border-slate-100 rounded-2xl flex justify-between items-center hover:border-indigo-600 hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                <Layout size={20} />
                                            </div>
                                            <div className="text-left">
                                                <span className="font-black text-slate-800 block">{item.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{item.size} • {item.ramType}</span>
                                            </div>
                                        </div>
                                        <span className="font-mono font-black text-indigo-600">${item.price}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 5 && (
                        <motion.div 
                            key="step-5"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Graphics Processor</h2>
                            <p className="text-sm text-slate-500 mb-8 font-medium">Visual throughput and compute density.</p>
                            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto p-4 bg-slate-50/50 rounded-3xl border border-slate-100">
                                {[...hardwareData.GPU.NVIDIA, ...hardwareData.GPU.AMD, ...hardwareData.GPU.Intel].map(item => (
                                    <button 
                                        key={item.name} 
                                        onClick={() => handleSelect('gpu', item)} 
                                        className="p-5 bg-white border border-slate-100 rounded-2xl text-left flex justify-between items-center hover:border-indigo-600 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                <Gamepad2 size={20} />
                                            </div>
                                            <span className="font-black text-slate-800 text-sm">{item.name}</span>
                                        </div>
                                        <span className="text-indigo-600 font-mono font-black">${item.price}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 6 && (
                        <motion.div 
                            key="step-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Memory Capacity</h2>
                            {!isMac && <p className="text-sm text-slate-500 mb-8 font-medium italic">Filtered for {selections.motherboard?.ramType || selections.cpu?.ramType}</p>}
                            <div className="grid grid-cols-1 gap-4">
                                {(isMac ? hardwareData.ram.mac : hardwareData.ram.pc.filter(r => r.ramType === (selections.motherboard?.ramType || selections.cpu?.ramType))).map(item => (
                                    <button 
                                        key={item.size} 
                                        onClick={() => handleSelect('ram', item)} 
                                        className="p-8 bg-white border border-slate-100 rounded-3xl flex justify-between items-center hover:border-indigo-600 hover:shadow-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <MemoryStick className="text-slate-200 group-hover:text-indigo-100 transition-colors" size={32} />
                                            <span className="font-black text-slate-900 text-2xl">{item.size}</span>
                                        </div>
                                        <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">${item.price}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 7 && (
                        <motion.div 
                            key="step-7"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-8">High-Speed Storage</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {hardwareData.Storage.map(item => (
                                    <button 
                                        key={item.size} 
                                        onClick={() => handleSelect('storage', item)} 
                                        className="p-8 bg-white border border-slate-100 rounded-3xl flex justify-between items-center hover:border-indigo-600 hover:shadow-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <HardDrive className="text-slate-200 group-hover:text-indigo-100 transition-colors" size={32} />
                                            <span className="font-black text-slate-900 text-2xl">{item.size}</span>
                                        </div>
                                        <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">${item.price}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 11 && (
                        <motion.div 
                            key="step-11"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-8">Thermal Management</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {hardwareData.Cooling.map(item => (
                                    <button 
                                        key={item.name} 
                                        onClick={() => handleSelect('cooling', item)} 
                                        className="p-6 bg-white border border-slate-100 rounded-2xl flex justify-between items-center hover:border-indigo-600 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                <Wind size={20} />
                                            </div>
                                            <div className="text-left">
                                                <span className="font-black text-slate-800 block">{item.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{item.type}</span>
                                            </div>
                                        </div>
                                        <span className="font-mono font-black text-indigo-600">${item.price}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 12 && (
                        <motion.div 
                            key="step-12"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Chassis Selection</h2>
                            <p className="text-sm text-slate-500 mb-8 font-medium italic">Supporting {selections.motherboard?.size} Boards</p>
                            <div className="grid grid-cols-1 gap-4">
                                {hardwareData.Case.filter(c => {
                                    if (selections.motherboard?.size === 'ATX') return c.size === 'ATX';
                                    return true;
                                }).map(item => (
                                    <button 
                                        key={item.name} 
                                        onClick={() => handleSelect('case', item)} 
                                        className="p-6 bg-white border border-slate-100 rounded-2xl flex justify-between items-center hover:border-indigo-600 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                <Box size={20} />
                                            </div>
                                            <div className="text-left">
                                                <span className="font-black text-slate-800 block">{item.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{item.size}</span>
                                            </div>
                                        </div>
                                        <span className="font-mono font-black text-indigo-600">${item.price}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 13 && (
                        <motion.div 
                            key="step-13"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-8">Power Supply Unit</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {hardwareData.PSU.map(item => (
                                    <button 
                                        key={item.name} 
                                        onClick={() => handleSelect('psu', item)} 
                                        className="p-6 bg-white border border-slate-100 rounded-2xl flex justify-between items-center hover:border-indigo-600 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                <Zap size={20} />
                                            </div>
                                            <div className="text-left">
                                                <span className="font-black text-slate-800 block">{item.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{item.wattage}W Gold</span>
                                            </div>
                                        </div>
                                        <span className="font-mono font-black text-indigo-600">${item.price}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 8 && (
                        <motion.div 
                            key="step-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-8">Select Power Solution</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {hardwareData.chargers.map(item => (
                                    <button 
                                        key={item.name} 
                                        onClick={() => handleSelect('charger', item)} 
                                        className="p-8 bg-white border border-slate-100 rounded-3xl flex justify-between items-center hover:border-indigo-600 hover:shadow-2xl transition-all"
                                    >
                                        <span className="font-black text-slate-900 text-xl">{item.name}</span>
                                        <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">${item.price}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 9 && (
                        <motion.div 
                            key="step-9"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="py-6" 
                            role="status"
                        >
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 className="text-4xl font-black mb-10 text-slate-900 tracking-tight">Configuration Complete.</h2>
                            
                            <div id="manual-build-summary" className="text-left bg-slate-900 text-white p-10 rounded-[2.5rem] mb-10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                                    <Cpu size={120} />
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <SummaryRow label="System OS" value={selections.os?.name} />
                                    {selections.hardware && <SummaryRow label="Base Platform" value={selections.hardware.name} />}
                                    <SummaryRow label="Processor" value={selections.cpu?.name} />
                                    {selections.motherboard && <SummaryRow label="Motherboard" value={selections.motherboard.name} />}
                                    {selections.gpu && <SummaryRow label="Graphics" value={selections.gpu.name} />}
                                    <SummaryRow label="Memory" value={selections.ram?.size} />
                                    <SummaryRow label="Storage" value={selections.storage?.size} />
                                    {selections.cooling && <SummaryRow label="Cooling" value={selections.cooling.name} />}
                                    {selections.case && <SummaryRow label="Chassis" value={selections.case.name} />}
                                    {selections.psu && <SummaryRow label="Power Supply" value={selections.psu.name} />}
                                    {selections.charger && <SummaryRow label="Adapter" value={selections.charger.name} />}
                                </div>
                                <div className="mt-10 pt-8 border-t border-white/10 relative z-10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px] block mb-2">Investment Value</span>
                                            <p className="text-5xl font-black text-white tracking-tighter">${totalPrice}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Build Verified</p>
                                            <p className="text-white/40 text-[9px] uppercase tracking-widest mt-1 italic">Neural-checked for 2026</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 justify-center">
                                <button 
                                    onClick={() => dispatch({ type: 'RESET' })}
                                    className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3"
                                >
                                    New Build
                                </button>
                                <button 
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="bg-white border-2 border-slate-100 text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {exporting ? <Loader2 className="animate-spin" size={20} /> : <FileDown size={20} />}
                                    {exporting ? 'Generating...' : 'Print Specs'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {currentStep > 0 && currentStep < 9 && (
                    <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                        <button 
                            onClick={() => dispatch({ type: 'PREVIOUS_STEP' })} 
                            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px] transition-all group"
                        >
                            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return
                        </button>
                        <div className="text-right">
                            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[9px] mb-1">Configuration Total</p>
                            <p className="text-4xl font-black text-indigo-600 font-mono tracking-tighter flex items-center gap-1">
                                <span className="text-xl opacity-40">$</span>
                                {totalPrice}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Build;