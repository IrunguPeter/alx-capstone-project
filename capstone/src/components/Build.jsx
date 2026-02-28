import { useState } from 'react';

//Function to show the build questions when New build is clicked
function Build () {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return(
        <div className="text-center justify-center mx-4 px-2 p-6 hover:bg-gray-400 rounded-lg">
            <h1>Answer some questions</h1>
            <button>
                Get started
            </button>
            {/*On click Start the questions */}
            {/*The type of Operating system: MacOS, Windows 11 or Linux(Ubuntu, ZorinOS, ArchLinux, fedora) */}
            {/*Portability: if yes, laptop, if no, desktop*/}
            {/*CPU: if OS= MAC, intel or Apple silicon ..Can choose apple silicon from (M1, M2, M3, M4 or M5)... if OS= Linux, choose from intel, AMD.. if OS=Windows, intel, AMD or Snap Dragon*/}
            {/*GPU: if OS=MAC, GPU=Integrated, if OS=Windows or Linux, GPU can be integrated or dedicated */}
            {/*if GPU=integrated, do not show any options, but if GPU=Dedicated, intel(Arc B580), Amd(Radeon 5700xt, 5800xt,6800xt, 6750xt, 7900xtx, 9060 xt, rx 9070, rx 9070xt), Nvidia GTX(1080ti, 1660, 1660ti, 1660 super) RTX(2060, 2060 super, 2080, 2080 ti, 2080 super, 3060, 3060ti, 3070, 3070 ti, 3080, 3080 ti, 3090, 3090 ti, 4060, 4060 ti, 4070, 4070 ti, 4080, 4080 ti, 4080 super, 4090, 4090 ti, 5060, 5060 ti, 5070, 5070 ti, 5080, 5080 ti, 5090*/}
            {/* RAm: Capacity(8,16,32,64,48,128,256) Type (DDR5, DDR4*/}
            {/*SSD Type(SATA, M.2,PCIE), GENERATION(gen 3, 4,5) , capacity(256,512,1 tb, 2tb, 4 tb, 8tb*/}
            {/*Power Supply Wattage(650, 750, 800, 850, 1000, 500, 600) */}
            {/*Case M-ATX, ATX, MicroATX, MiniAtx, Same as or more than motherboard size*/}
            {/*Motherboard: Has to be the same socket as the CPU, Not cause a bottle neck, */}
            {/*Cooling (type: Liquid cooler, Air cooler), Liquid Coolers(Custom Liquid cooled, AIO cooler) Air cooler(CPU Fan coolers, Official)*/}

        </div>
    );
    


};
  
export default Build;
  