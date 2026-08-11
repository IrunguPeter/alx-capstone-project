import { useReducer, useEffect, useRef, useState, Fragment } from 'react';
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
  Loader2,
  AlertCircle,
  MousePointer2,
  Keyboard,
  Headphones,
  Tv
} from 'lucide-react';
import hardwareData from '../data/hardware.json';
import { exportToPDF } from '../utils/pdfExport';
import Checkout from './checkout';

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
        monitor: null,
        keyboard: null,
        mouse: null,
        headset: null,
    },
    totalPrice: 0,
    totalWattage: 0,
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
  { id: 14, name: 'Display', icon: Tv },
  { id: 15, name: 'Keys', icon: Keyboard },
  { id: 16, name: 'Mouse', icon: MousePointer2 },
  { id: 17, name: 'Audio', icon: Headphones },
];

function reducer(state, action) {
    switch (action.type) {
        case 'SELECT_ITEM': {
            const { category, item } = action.payload;
            const newSelections = { ...state.selections, [category]: item };
            const newPrice = Object.values(newSelections)
                .reduce((acc, curr) => acc + (curr?.price || 0), 0);
            const newWattage = Object.values(newSelections)
                .reduce((acc, curr) => acc + (curr?.tdp || 0), 0);
            
            let nextStep = state.currentStep;
            const isMac = newSelections.os?.name.includes('Mac');

            if (category === 'os') {
                nextStep = item.name.includes('Mac') ? 2 : 4;
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
                   nextStep = isMacBook ? 8 : 14;
                } else {
                   nextStep = 11;
                }
            } else if (category === 'cooling') {
                nextStep = 12;
            } else if (category === 'case') {
                nextStep = 13;
            } else if (category === 'psu') {
                nextStep = 14;
            } else if (category === 'charger') {
                nextStep = 14;
            } else if (category === 'monitor') {
                nextStep = 15;
            } else if (category === 'keyboard') {
                nextStep = 16;
            } else if (category === 'mouse') {
                nextStep = 17;
            } else if (category === 'headset') {
                nextStep = 9;
            }

            return {
                ...state,
                selections: newSelections,
                totalPrice: newPrice,
                totalWattage: newWattage,
                currentStep: nextStep,
            };
        }
        case 'PREVIOUS_STEP': {
            let prevStep = state.currentStep - 1;
            const isMac = state.selections.os?.name.includes('Mac');

            if (state.currentStep === 2) prevStep = 1;
            else if (state.currentStep === 4) prevStep = isMac ? 2 : 1;
            else if (state.currentStep === 10) prevStep = 4;
            else if (state.currentStep === 5) prevStep = 10;
            else if (state.currentStep === 6) prevStep = isMac ? 4 : 5;
            else if (state.currentStep === 7) prevStep = 6;
            else if (state.currentStep === 11) prevStep = 7;
            else if (state.currentStep === 12) prevStep = 11;
            else if (state.currentStep === 13) prevStep = 12;
            else if (state.currentStep === 8) prevStep = 7;
            else if (state.currentStep === 14) {
                if (isMac) {
                    prevStep = state.selections.charger ? 8 : 7;
                } else {
                    prevStep = 13;
                }
            }
            else if (state.currentStep === 15) prevStep = 14;
            else if (state.currentStep === 16) prevStep = 15;
            else if (state.currentStep === 17) prevStep = 16;
            else if (state.currentStep === 9) prevStep = 17;

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

function SummaryRow({ label, value, vendor, url, image }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-ivory/10 last:border-0 group">
            <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden border border-ivory/10 group-hover:border-gold/40 transition-colors">
                    <img 
                        src={image || "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=100&auto=format&fit=crop"} 
                        alt={label}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="font-mono text-[9px] font-medium text-ivory/40 uppercase tracking-[0.2em]">{label}</span>
                    <span className="font-display font-medium text-sm text-ivory leading-tight">{value}</span>
                    {vendor && (
                        <span className="font-mono text-[8px] font-medium uppercase tracking-widest text-gold mt-1">
                            Source: {vendor}
                        </span>
                    )}
                </div>
            </div>
            {url && (
                <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-mono text-[9px] bg-white/5 hover:bg-white/10 text-ivory/60 hover:text-ivory px-3 py-1 rounded-full border border-ivory/10 transition-all font-medium uppercase tracking-widest"
                >
                    Link
                </a>
            )}
        </div>
    );
}

function HardwareTile({ item, onClick, subtext }) {
    return (
        <button 
            onClick={onClick}
            className="group flex flex-col h-full bg-white rounded-2xl border border-ink/5 overflow-hidden text-left transition-all duration-500 hover:border-ink/15 hover:shadow-luxury-card hover:-translate-y-0.5"
        >
            <div className="aspect-video w-full overflow-hidden bg-[#f0ece2]">
                <img 
                    src={item.image || "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop"} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 opacity-95 group-hover:opacity-100"
                />
            </div>
            <div className="p-6 flex flex-col flex-1">
                <span className="font-mono text-[9px] font-medium uppercase tracking-[0.25em] text-ink/40">{subtext}</span>
                <h3 className="mt-2 font-display font-medium text-lg leading-snug text-ink">{item.name || item.size}</h3>
                <div className="mt-auto pt-6 flex items-center justify-between">
                    <span className="font-display font-medium text-xl text-ink">${item.price}</span>
                    <span className="font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-burgundy opacity-0 group-hover:opacity-100 transition-opacity">
                        Select →
                    </span>
                </div>
            </div>
        </button>
    );
}

function Build() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stepRef = useRef(null);
    const [exporting, setExporting] = useState(false);

    const { currentStep, selections, totalPrice, totalWattage } = state;
    const isMac = selections.os?.name?.includes('Mac');
    const isPowerInsufficient = selections.psu && totalWattage > selections.psu.wattage;
    const powerSafetyMargin = selections.psu ? selections.psu.wattage - totalWattage : null;

    // Clearance Checks
    const isGpuTooLong = selections.case && selections.gpu && selections.gpu.length > selections.case.gpuClearance;
    const isCoolerTooTall = selections.case && selections.cooling && selections.cooling.height > selections.case.cpuClearance;
    const isCompatible = !isPowerInsufficient && !isGpuTooLong && !isCoolerTooTall;

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
            {currentStep > 0 && currentStep !== 9 && (
                <div className="mb-12 hidden md:flex items-center justify-center px-4 overflow-x-auto pb-2 custom-scrollbar">
                    {STEPS.filter(s => {
                        if (isMac) {
                           return [1, 2, 4, 6, 7, 8, 14, 15, 16, 17].includes(s.id);
                        } else {
                           return [1, 4, 10, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17].includes(s.id);
                        }
                    }).map((step, idx) => {
                        const isCompleted = currentStep > step.id || (currentStep === 3 && step.id === 2);
                        const isActive = currentStep === step.id || (currentStep === 3 && step.id === 4);
                        
                        return (
                            <Fragment key={step.id}>
                                {idx > 0 && <span className="h-px w-8 bg-ink/15 mx-4" />}
                                <span className={`font-mono text-[10px] uppercase tracking-[0.25em] whitespace-nowrap transition-colors ${
                                    isActive ? 'text-burgundy' :
                                    isCompleted ? 'text-ink' : 'text-ink/30'
                                }`}>
                                    {step.name}
                                </span>
                            </Fragment>
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
                            <div className="w-20 h-20 bg-burgundy/5 text-burgundy rounded-full flex items-center justify-center mx-auto mb-8 border border-burgundy/10">
                                <Cpu size={36} />
                            </div>
                            <h3 className="font-display font-medium text-4xl text-ink mb-4">Precision Configurator</h3>
                            <p className="text-ink-soft mb-10 text-lg font-light max-w-md mx-auto">Select each component with care for your next high-performance machine.</p>
                            <button 
                                onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
                                className="bg-burgundy text-white px-12 py-4 rounded-full font-medium text-lg hover:bg-burgundy-deep transition-all focus:ring-4 focus:ring-burgundy/20"
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
                            <h2 className="font-display font-medium text-3xl text-ink mb-8">Choose your Ecosystem</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {hardwareData.os.map((item) => (
                                    <HardwareTile 
                                        key={item.name}
                                        item={item}
                                        onClick={() => handleSelect('os', item)}
                                        icon={item.name.includes('Mac') ? Laptop : Monitor}
                                        subtext="Operating System"
                                    />
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
                            <h2 className="font-display font-medium text-3xl text-ink mb-8">Select Base Platform</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-6 bg-paper/70 rounded-[2.5rem] border border-ink/5 custom-scrollbar">
                                {Object.entries(hardwareData.mac_hardware).map(([category, items]) => (
                                    <div key={category} className="md:col-span-full mb-8 first:mt-0">
                                        <h3 className="text-left font-mono text-[10px] font-medium text-ink-soft uppercase tracking-[0.3em] mb-6 px-4 flex items-center gap-4">
                                            {category}
                                            <div className="h-px flex-1 bg-ink/10" />
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {items.map(item => (
                                                <HardwareTile 
                                                    key={item.name}
                                                    item={item}
                                                    onClick={() => handleSelect('hardware', item)}
                                                    icon={Laptop}
                                                    subtext={category}
                                                />
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
                            <h2 className="font-display font-medium text-3xl text-ink mb-8">Select Processing Core</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-6 bg-paper/70 rounded-[2.5rem] border border-ink/5">
                                {(isMac ? hardwareData.CPU["Apple Silicon"] : [...hardwareData.CPU.Intel, ...hardwareData.CPU.AMD]).map(item => (
                                    <HardwareTile 
                                        key={item.name}
                                        item={item}
                                        onClick={() => handleSelect('cpu', item)}
                                        icon={Cpu}
                                        subtext={!isMac ? `${item.socket} • ${item.ramType}` : "System on Chip"}
                                    />
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
                            <h2 className="font-display font-medium text-3xl text-ink mb-2">Compatible Motherboard</h2>
                            <p className="text-sm text-ink-soft mb-8 font-medium italic">Filtered for {selections.cpu?.socket} Socket</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-6 bg-paper/70 rounded-[2.5rem] border border-ink/5">
                                {hardwareData.Motherboard.filter(mb => mb.socket === selections.cpu?.socket).map(item => (
                                    <HardwareTile 
                                        key={item.name}
                                        item={item}
                                        onClick={() => handleSelect('motherboard', item)}
                                        icon={Layout}
                                        subtext={`${item.size} • ${item.ramType}`}
                                    />
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
                            <h2 className="font-display font-medium text-3xl text-ink mb-2">Graphics Processor</h2>
                            <p className="text-sm text-ink-soft mb-8 font-medium">Visual throughput and compute density.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-6 bg-paper/70 rounded-[2.5rem] border border-ink/5">
                                {[...hardwareData.GPU.NVIDIA, ...hardwareData.GPU.AMD, ...hardwareData.GPU.Intel].map(item => (
                                    <HardwareTile 
                                        key={item.name}
                                        item={item}
                                        onClick={() => handleSelect('gpu', item)}
                                        icon={Gamepad2}
                                        subtext={item.tdp ? `${item.tdp}W TDP` : "Integrated"}
                                    />
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
                            <h2 className="font-display font-medium text-3xl text-ink mb-2">Memory Capacity</h2>
                            {!isMac && <p className="text-sm text-ink-soft mb-8 font-medium italic">Filtered for {selections.motherboard?.ramType || selections.cpu?.ramType}</p>}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(isMac ? hardwareData.ram.mac : hardwareData.ram.pc.filter(r => r.ramType === (selections.motherboard?.ramType || selections.cpu?.ramType))).map(item => (
                                    <HardwareTile 
                                        key={item.size}
                                        item={{ ...item, name: item.size }}
                                        onClick={() => handleSelect('ram', item)}
                                        icon={MemoryStick}
                                        subtext={item.ramType || "Unified Memory"}
                                    />
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
                            <h2 className="font-display font-medium text-3xl text-ink mb-8">High-Speed Storage</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hardwareData.Storage.map(item => (
                                    <HardwareTile 
                                        key={item.size}
                                        item={{ ...item, name: item.size }}
                                        onClick={() => handleSelect('storage', item)}
                                        icon={HardDrive}
                                        subtext="NVMe PCIe SSD"
                                    />
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
                            <h2 className="font-display font-medium text-3xl text-ink mb-8">Thermal Management</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hardwareData.Cooling.map(item => (
                                    <HardwareTile 
                                        key={item.name}
                                        item={item}
                                        onClick={() => handleSelect('cooling', item)}
                                        icon={Wind}
                                        subtext={`${item.type} Cooling`}
                                    />
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
                            <h2 className="font-display font-medium text-3xl text-ink mb-2">Chassis Selection</h2>
                            <p className="text-sm text-ink-soft mb-8 font-medium italic">Supporting {selections.motherboard?.size} Boards</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hardwareData.Case.filter(c => {
                                    if (selections.motherboard?.size === 'ATX') return c.size === 'ATX';
                                    return true;
                                }).map(item => (
                                    <HardwareTile 
                                        key={item.name}
                                        item={item}
                                        onClick={() => handleSelect('case', item)}
                                        icon={Box}
                                        subtext={item.size}
                                    />
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
                            <h2 className="font-display font-medium text-3xl text-ink mb-8">Power Supply Unit</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hardwareData.PSU.map(item => (
                                    <HardwareTile 
                                        key={item.name}
                                        item={item}
                                        onClick={() => handleSelect('psu', item)}
                                        icon={Zap}
                                        subtext={`${item.wattage}W Rated`}
                                    />
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
                            <h2 className="font-display font-medium text-3xl text-ink mb-8">Select Power Solution</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hardwareData.chargers.map(item => (
                                    <HardwareTile 
                                        key={item.name}
                                        item={item}
                                        onClick={() => handleSelect('charger', item)}
                                        icon={Zap}
                                        subtext="Power Adapter"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 14 && (
                        <motion.div 
                            key="step-14"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-display font-medium text-3xl text-ink">Select Visual Display</h2>
                                <button 
                                    onClick={() => handleSelect('monitor', null)}
                                    className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink/40 hover:text-burgundy transition-colors border border-ink/10 hover:border-ink/30 px-4 py-2 rounded-full"
                                >
                                    Skip this Step
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-6 bg-paper/70 rounded-[2.5rem] border border-ink/5">
                                {hardwareData.Monitors.map(item => (
                                    <HardwareTile 
                                        key={item.name}
                                        item={item}
                                        onClick={() => handleSelect('monitor', item)}
                                        icon={Tv}
                                        subtext={`${item.resolution} • ${item.refreshRate}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 15 && (
                        <motion.div 
                            key="step-15"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-display font-medium text-3xl text-ink">Choose Input Device</h2>
                                <button 
                                    onClick={() => handleSelect('keyboard', null)}
                                    className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink/40 hover:text-burgundy transition-colors border border-ink/10 hover:border-ink/30 px-4 py-2 rounded-full"
                                >
                                    Skip this Step
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-6 bg-paper/70 rounded-[2.5rem] border border-ink/5">
                                {hardwareData.Keyboards.map(item => (
                                    <HardwareTile 
                                        key={item.name}
                                        item={item}
                                        onClick={() => handleSelect('keyboard', item)}
                                        icon={Keyboard}
                                        subtext={`${item.formFactor} • ${item.switchType}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 16 && (
                        <motion.div 
                            key="step-16"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-display font-medium text-3xl text-ink">Precision Tracking</h2>
                                <button 
                                    onClick={() => handleSelect('mouse', null)}
                                    className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink/40 hover:text-burgundy transition-colors border border-ink/10 hover:border-ink/30 px-4 py-2 rounded-full"
                                >
                                    Skip this Step
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-6 bg-paper/70 rounded-[2.5rem] border border-ink/5">
                                {hardwareData.Mice.map(item => (
                                    <HardwareTile 
                                        key={item.name}
                                        item={item}
                                        onClick={() => handleSelect('mouse', item)}
                                        icon={MousePointer2}
                                        subtext={`${item.weight} • ${item.sensor}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 17 && (
                        <motion.div 
                            key="step-17"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-display font-medium text-3xl text-ink">Acoustic Engineering</h2>
                                <button 
                                    onClick={() => handleSelect('headset', null)}
                                    className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink/40 hover:text-burgundy transition-colors border border-ink/10 hover:border-ink/30 px-4 py-2 rounded-full"
                                >
                                    Skip this Step
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-6 bg-paper/70 rounded-[2.5rem] border border-ink/5">
                                {hardwareData.Headsets.map(item => (
                                    <HardwareTile 
                                        key={item.name}
                                        item={item}
                                        onClick={() => handleSelect('headset', item)}
                                        icon={Headphones}
                                        subtext={`${item.type} • ${item.wireless ? 'Wireless' : 'Wired'}`}
                                    />
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
                            <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/30">
                                <CheckCircle2 size={36} />
                            </div>
                            <h2 className="font-display font-medium text-4xl mb-10 text-ink tracking-tight">Configuration Complete.</h2>
                            
                            <div id="manual-build-summary" className="text-left bg-ink text-ivory p-10 rounded-[2.5rem] mb-10 shadow-luxury-panel">
                                <div className="space-y-1">
                                    <SummaryRow label="System OS" value={selections.os?.name} vendor={selections.os?.vendor} url={selections.os?.url} image={selections.os?.image} />
                                    {selections.hardware && <SummaryRow label="Base Platform" value={selections.hardware.name} vendor={selections.hardware.vendor} url={selections.hardware.url} image={selections.hardware.image} />}
                                    <SummaryRow label="Processor" value={selections.cpu?.name} vendor={selections.cpu?.vendor} url={selections.cpu?.url} image={selections.cpu?.image} />
                                    {selections.motherboard && <SummaryRow label="Motherboard" value={selections.motherboard.name} vendor={selections.motherboard.vendor} url={selections.motherboard.url} image={selections.motherboard.image} />}
                                    {selections.gpu && <SummaryRow label="Graphics" value={selections.gpu.name} vendor={selections.gpu?.vendor} url={selections.gpu?.url} image={selections.gpu?.image} />}
                                    <SummaryRow label="Memory" value={selections.ram?.size} vendor={selections.ram?.vendor} url={selections.ram?.url} image={selections.ram?.image} />
                                    <SummaryRow label="Storage" value={selections.storage?.size} vendor={selections.storage?.vendor} url={selections.storage?.url} image={selections.storage?.image} />
                                    {selections.cooling && <SummaryRow label="Cooling" value={selections.cooling.name} vendor={selections.cooling.vendor} url={selections.cooling.url} image={selections.cooling.image} />}
                                    {selections.case && <SummaryRow label="Chassis" value={selections.case.name} vendor={selections.case.vendor} url={selections.case.url} image={selections.case.image} />}
                                    {selections.psu && <SummaryRow label="Power Supply" value={selections.psu.name} vendor={selections.psu.vendor} url={selections.psu.url} image={selections.psu.image} />}
                                    {selections.charger && <SummaryRow label="Adapter" value={selections.charger.name} vendor={selections.charger.vendor} url={selections.charger.url} image={selections.charger.image} />}
                                    {selections.monitor && <SummaryRow label="Display" value={selections.monitor.name} vendor={selections.monitor.vendor} url={selections.monitor.url} image={selections.monitor.image} />}
                                    {selections.keyboard && <SummaryRow label="Keyboard" value={selections.keyboard.name} vendor={selections.keyboard.vendor} url={selections.keyboard.url} image={selections.keyboard.image} />}
                                    {selections.mouse && <SummaryRow label="Mouse" value={selections.mouse.name} vendor={selections.mouse.vendor} url={selections.mouse.url} image={selections.mouse.image} />}
                                    {selections.headset && <SummaryRow label="Headset" value={selections.headset.name} vendor={selections.headset.vendor} url={selections.headset.url} image={selections.headset.image} />}
                                    
                                    {!isMac && (
                                        <div className="pt-4 mt-4 border-t border-ivory/10 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-mono text-[9px] font-medium text-ivory/40 uppercase tracking-[0.2em]">Power Draw</span>
                                                <span className="text-ivory font-medium text-sm">{totalWattage}W</span>
                                            </div>
                                            {selections.psu && (
                                                <div className="flex justify-between items-center">
                                                    <span className="font-mono text-[9px] font-medium text-ivory/40 uppercase tracking-[0.2em]">Safety Margin</span>
                                                    <span className={`font-medium text-sm ${isPowerInsufficient ? 'text-red-300' : 'text-gold'}`}>
                                                        {powerSafetyMargin}W
                                                    </span>
                                                </div>
                                            )}
                                            {(isGpuTooLong || isCoolerTooTall) && (
                                                <div className="pt-2 space-y-2">
                                                    {isGpuTooLong && (
                                                        <div className="flex justify-between items-center text-red-300">
                                                            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.2em]">GPU Clearance</span>
                                                            <span className="font-medium text-xs">Exceeded</span>
                                                        </div>
                                                    )}
                                                    {isCoolerTooTall && (
                                                        <div className="flex justify-between items-center text-red-300">
                                                            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.2em]">Cooler Height</span>
                                                            <span className="font-medium text-xs">Exceeded</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {(isPowerInsufficient || isGpuTooLong || isCoolerTooTall) && (
                                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/40 rounded-2xl flex flex-col gap-2 animate-pulse">
                                        {isPowerInsufficient && (
                                            <div className="flex items-center gap-3">
                                                <AlertCircle className="text-red-300" size={16} />
                                                <p className="text-red-200 font-mono text-[10px] font-medium uppercase tracking-wider text-left">Power draw exceeds PSU capacity!</p>
                                            </div>
                                        )}
                                        {isGpuTooLong && (
                                            <div className="flex items-center gap-3">
                                                <AlertCircle className="text-red-300" size={16} />
                                                <p className="text-red-200 font-mono text-[10px] font-medium uppercase tracking-wider text-left">GPU is too long for this case!</p>
                                            </div>
                                        )}
                                        {isCoolerTooTall && (
                                            <div className="flex items-center gap-3">
                                                <AlertCircle className="text-red-300" size={16} />
                                                <p className="text-red-200 font-mono text-[10px] font-medium uppercase tracking-wider text-left">CPU Cooler is too tall for this case!</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="mt-10 pt-8 border-t border-ivory/10 relative z-10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="font-mono text-[9px] font-medium text-ivory/40 uppercase tracking-[0.3em] block mb-2">Investment Value</span>
                                            <p className="font-display font-medium text-5xl text-gold tracking-tight">${totalPrice}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-medium text-xs uppercase tracking-widest ${isCompatible ? 'text-gold' : 'text-red-300'}`}>
                                                {isCompatible ? 'Build Verified' : 'Incompatible Build'}
                                            </p>
                                            <p className="font-mono text-[9px] font-medium text-ivory/40 uppercase tracking-widest mt-1">
                                                {isCompatible ? 'Rule-checked for 2026' : 'Safety Violation Detected'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    onClick={() => dispatch({ type: 'RESET' })}
                                    className="bg-burgundy text-white px-10 py-4 rounded-full font-medium text-lg hover:bg-burgundy-deep transition-all flex items-center justify-center gap-3"
                                >
                                    New Build
                                </button>
                                <button 
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="bg-transparent border border-ivory/20 text-ivory px-10 py-4 rounded-full font-medium text-lg hover:border-ivory/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {exporting ? <Loader2 className="animate-spin" size={20} /> : <FileDown size={20} />}
                                    {exporting ? 'Generating...' : 'Print Specs'}
                                </button>
                                <Checkout 
                                    amount={totalPrice} 
                                    label="Donate Build Cost"
                                    className="bg-white text-ink px-10 py-4 rounded-full font-medium text-lg hover:bg-ivory transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {currentStep > 0 && currentStep !== 9 && (
                    <div className="mt-12 pt-8 border-t border-ink/10 flex justify-between items-center">
                        <button 
                            onClick={() => dispatch({ type: 'PREVIOUS_STEP' })} 
                            className="flex items-center gap-2 text-ink/40 hover:text-ink font-medium uppercase tracking-[0.2em] text-[10px] transition-all group"
                        >
                            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return
                        </button>
                        <div className="text-right">
                            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-ink/40 mb-1">Configuration Total</p>
                            <p className="font-display font-medium text-4xl text-burgundy tracking-tight flex items-center gap-1">
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