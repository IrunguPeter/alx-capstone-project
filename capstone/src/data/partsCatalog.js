// Structured parts catalog for the deterministic build curator.
// perf.{gaming,productivity} are relative indices 0-100 (higher = better).
// All other fields are machine-readable compatibility constraints.

const IMG = {
  cpu: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop",
  gpu: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop",
  motherboard: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop",
  ram: "https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=400&auto=format&fit=crop",
  storage: "https://images.unsplash.com/photo-1597872200370-493dea239322?q=80&w=400&auto=format&fit=crop",
  cooling: "https://images.unsplash.com/photo-1587202395166-439ca08536df?q=80&w=400&auto=format&fit=crop",
  case: "https://images.unsplash.com/photo-1587202395166-439ca08536df?q=80&w=400&auto=format&fit=crop",
  psu: "https://images.unsplash.com/photo-1587202395166-439ca08536df?q=80&w=400&auto=format&fit=crop",
};

export const CATALOG = {
  cpu: [
    { id: "r5-9600x", name: "AMD Ryzen 5 9600X", price: 229, perf: { gaming: 76, productivity: 74 }, tdp: 65, cores: 6, socket: "AM5", ramType: "DDR5", vendor: "Amazon", url: "https://amazon.com", image: IMG.cpu },
    { id: "r7-9700x", name: "AMD Ryzen 7 9700X", price: 359, perf: { gaming: 84, productivity: 86 }, tdp: 65, cores: 8, socket: "AM5", ramType: "DDR5", vendor: "ESGaming", url: "https://esgaming.co.ke", image: IMG.cpu },
    { id: "r7-9800x3d", name: "AMD Ryzen 7 9800X3D", price: 479, perf: { gaming: 97, productivity: 86 }, tdp: 120, cores: 8, socket: "AM5", ramType: "DDR5", vendor: "Amazon", url: "https://amazon.com", image: IMG.cpu },
    { id: "r9-9900x", name: "AMD Ryzen 9 9900X", price: 499, perf: { gaming: 86, productivity: 93 }, tdp: 120, cores: 12, socket: "AM5", ramType: "DDR5", vendor: "ShufflePCs", url: "https://shufflepcs.co.ke", image: IMG.cpu },
    { id: "r9-9950x", name: "AMD Ryzen 9 9950X", price: 649, perf: { gaming: 89, productivity: 99 }, tdp: 170, cores: 16, socket: "AM5", ramType: "DDR5", vendor: "ESGaming", url: "https://esgaming.co.ke", image: IMG.cpu },
    { id: "r9-9950x3d", name: "AMD Ryzen 9 9950X3D", price: 749, perf: { gaming: 99, productivity: 98 }, tdp: 170, cores: 16, socket: "AM5", ramType: "DDR5", vendor: "Amazon", url: "https://amazon.com", image: IMG.cpu },
    { id: "cu9-285k", name: "Intel Core Ultra 9 285K", price: 629, perf: { gaming: 88, productivity: 94 }, tdp: 125, cores: 24, socket: "LGA1851", ramType: "DDR5", vendor: "ESGaming", url: "https://esgaming.co.ke", image: IMG.cpu },
    { id: "cu7-265k", name: "Intel Core Ultra 7 265K", price: 449, perf: { gaming: 85, productivity: 89 }, tdp: 125, cores: 20, socket: "LGA1851", ramType: "DDR5", vendor: "Amazon", url: "https://amazon.com", image: IMG.cpu },
    { id: "cu5-245k", name: "Intel Core Ultra 5 245K", price: 309, perf: { gaming: 79, productivity: 80 }, tdp: 125, cores: 14, socket: "LGA1851", ramType: "DDR5", vendor: "AliExpress", url: "https://aliexpress.com", image: IMG.cpu },
    { id: "i5-14600k", name: "Intel Core i5-14600K", price: 279, perf: { gaming: 84, productivity: 82 }, tdp: 125, cores: 14, socket: "LGA1700", ramType: "DDR5", vendor: "eBay", url: "https://ebay.com", image: IMG.cpu },
    { id: "i3-14100f", name: "Intel Core i3-14100F", price: 99, perf: { gaming: 62, productivity: 58 }, tdp: 60, cores: 4, socket: "LGA1700", ramType: "DDR5", vendor: "AliExpress", url: "https://aliexpress.com", image: IMG.cpu },
  ],
  motherboard: [
    { id: "msi-z890-carbon", name: "MSI MPG Z890 Carbon WiFi", price: 499, socket: "LGA1851", ramType: "DDR5", size: "ATX", tdp: 45, vendor: "Amazon", url: "https://amazon.com", image: IMG.motherboard },
    { id: "asus-z890-hero", name: "ASUS ROG Maximus Z890 Hero", price: 699, socket: "LGA1851", ramType: "DDR5", size: "ATX", tdp: 50, vendor: "ESGaming", url: "https://esgaming.co.ke", image: IMG.motherboard },
    { id: "asus-b850-plus", name: "ASUS TUF Gaming B850-Plus", price: 229, socket: "AM5", ramType: "DDR5", size: "ATX", tdp: 30, vendor: "ESGaming", url: "https://esgaming.co.ke", image: IMG.motherboard },
    { id: "msi-b650-tomahawk", name: "MSI B650 Tomahawk WiFi", price: 199, socket: "AM5", ramType: "DDR5", size: "ATX", tdp: 30, vendor: "Amazon", url: "https://amazon.com", image: IMG.motherboard },
    { id: "asrock-b650m-riptide", name: "ASRock B650M PG Riptide", price: 159, socket: "AM5", ramType: "DDR5", size: "Micro-ATX", tdp: 25, vendor: "ShufflePCs", url: "https://shufflepcs.co.ke", image: IMG.motherboard },
    { id: "gigabyte-z790-elite", name: "Gigabyte Z790 Aorus Elite AX", price: 239, socket: "LGA1700", ramType: "DDR5", size: "ATX", tdp: 35, vendor: "Amazon", url: "https://amazon.com", image: IMG.motherboard },
    { id: "msi-b760m-bomber", name: "MSI B760M Bomber", price: 119, socket: "LGA1700", ramType: "DDR5", size: "Micro-ATX", tdp: 25, vendor: "AliExpress", url: "https://aliexpress.com", image: IMG.motherboard },
  ],
  gpu: [
    { id: "rtx-5090", name: "NVIDIA GeForce RTX 5090", price: 1799, perf: { gaming: 100, productivity: 98 }, tdp: 575, vram: 32, length: 335, vendor: "Amazon", url: "https://amazon.com", image: IMG.gpu },
    { id: "rtx-5080", name: "NVIDIA GeForce RTX 5080", price: 1199, perf: { gaming: 91, productivity: 89 }, tdp: 360, vram: 16, length: 315, vendor: "ESGaming", url: "https://esgaming.co.ke", image: IMG.gpu },
    { id: "rtx-5070-ti", name: "NVIDIA GeForce RTX 5070 Ti", price: 749, perf: { gaming: 87, productivity: 84 }, tdp: 300, vram: 16, length: 304, vendor: "ShufflePCs", url: "https://shufflepcs.co.ke", image: IMG.gpu },
    { id: "rtx-5070", name: "NVIDIA GeForce RTX 5070", price: 599, perf: { gaming: 79, productivity: 75 }, tdp: 250, vram: 12, length: 242, vendor: "Amazon", url: "https://amazon.com", image: IMG.gpu },
    { id: "rx-9070-xt", name: "AMD Radeon RX 9070 XT", price: 699, perf: { gaming: 85, productivity: 79 }, tdp: 315, vram: 16, length: 286, vendor: "ESGaming", url: "https://esgaming.co.ke", image: IMG.gpu },
    { id: "rx-9070", name: "AMD Radeon RX 9070", price: 549, perf: { gaming: 79, productivity: 73 }, tdp: 220, vram: 16, length: 267, vendor: "ShufflePCs", url: "https://shufflepcs.co.ke", image: IMG.gpu },
    { id: "rx-9060-xt", name: "AMD Radeon RX 9060 XT", price: 329, perf: { gaming: 66, productivity: 61 }, tdp: 190, vram: 8, length: 242, vendor: "AliExpress", url: "https://aliexpress.com", image: IMG.gpu },
    { id: "arc-b580", name: "Intel Arc B580", price: 249, perf: { gaming: 63, productivity: 71 }, tdp: 190, vram: 12, length: 240, vendor: "AliExpress", url: "https://aliexpress.com", image: IMG.gpu },
    { id: "rtx-4060", name: "NVIDIA GeForce RTX 4060", price: 289, perf: { gaming: 64, productivity: 62 }, tdp: 115, vram: 8, length: 244, vendor: "Amazon", url: "https://amazon.com", image: IMG.gpu },
  ],
  ram: [
    { id: "ddr5-16-5600", name: "16GB (2x8GB) DDR5-5600", price: 49, capacityGB: 16, ramType: "DDR5", tdp: 8, vendor: "AliExpress", url: "https://aliexpress.com", image: IMG.ram },
    { id: "ddr5-32-6400-kingsbank", name: "32GB Kingsbank DDR5-6400", price: 85, capacityGB: 32, ramType: "DDR5", tdp: 12, vendor: "AliExpress", url: "https://aliexpress.com", image: IMG.ram },
    { id: "ddr5-32-6000", name: "32GB (2x16GB) DDR5-6000", price: 109, capacityGB: 32, ramType: "DDR5", tdp: 10, vendor: "ShufflePCs", url: "https://shufflepcs.co.ke", image: IMG.ram },
    { id: "ddr5-64-6000", name: "64GB (2x32GB) DDR5-6000", price: 189, capacityGB: 64, ramType: "DDR5", tdp: 15, vendor: "ESGaming", url: "https://esgaming.co.ke", image: IMG.ram },
    { id: "ddr5-96-6000", name: "96GB (2x48GB) DDR5-6000", price: 259, capacityGB: 96, ramType: "DDR5", tdp: 20, vendor: "Amazon", url: "https://amazon.com", image: IMG.ram },
  ],
  storage: [
    { id: "sn580-1tb", name: "1TB WD Blue SN580 NVMe", price: 69, capacityGB: 1000, tdp: 6, vendor: "Amazon", url: "https://amazon.com", image: IMG.storage },
    { id: "fanxiang-s880-2tb", name: "2TB Fanxiang S880 (Gen5)", price: 139, capacityGB: 2000, tdp: 10, vendor: "AliExpress", url: "https://aliexpress.com", image: IMG.storage },
    { id: "990-pro-2tb", name: "2TB Samsung 990 Pro", price: 169, capacityGB: 2000, tdp: 7, vendor: "ESGaming", url: "https://esgaming.co.ke", image: IMG.storage },
    { id: "sn850x-4tb", name: "4TB WD Black SN850X", price: 299, capacityGB: 4000, tdp: 8, vendor: "Amazon", url: "https://amazon.com", image: IMG.storage },
  ],
  cooling: [
    { id: "snowman-mt6", name: "Snowman MT6 Air Cooler", price: 25, type: "Air", height: 155, tdp: 5, vendor: "AliExpress", url: "https://aliexpress.com", image: IMG.cooling },
    { id: "pa120-se", name: "Thermalright Peerless Assassin 120 SE", price: 35, type: "Air", height: 155, tdp: 5, vendor: "AliExpress", url: "https://aliexpress.com", image: IMG.cooling },
    { id: "nh-d15", name: "Noctua NH-D15", price: 99, type: "Air", height: 165, tdp: 5, vendor: "Amazon", url: "https://amazon.com", image: IMG.cooling },
    { id: "lf3-360", name: "Arctic Liquid Freezer III 360", price: 115, type: "Liquid", height: 65, tdp: 20, vendor: "ESGaming", url: "https://esgaming.co.ke", image: IMG.cooling },
    { id: "mystique-360", name: "DeepCool Mystique 360 AIO", price: 185, type: "Liquid", height: 55, tdp: 25, vendor: "ShufflePCs", url: "https://shufflepcs.co.ke", image: IMG.cooling },
  ],
  case: [
    { id: "montech-air-100", name: "Montech AIR 100 ARGB", price: 65, size: "Micro-ATX", gpuClearance: 330, cpuClearance: 155, vendor: "AliExpress", url: "https://aliexpress.com", image: IMG.case },
    { id: "fractal-north", name: "Fractal Design North", price: 139, size: "ATX", gpuClearance: 355, cpuClearance: 170, vendor: "Amazon", url: "https://amazon.com", image: IMG.case },
    { id: "nzxt-h9-flow", name: "NZXT H9 Flow", price: 159, size: "ATX", gpuClearance: 435, cpuClearance: 165, vendor: "Amazon", url: "https://amazon.com", image: IMG.case },
    { id: "lianli-o11-vision", name: "Lian Li Vision O11", price: 189, size: "ATX", gpuClearance: 455, cpuClearance: 167, vendor: "ShufflePCs", url: "https://shufflepcs.co.ke", image: IMG.case },
  ],
  psu: [
    { id: "cx650", name: "Corsair CX650", price: 79, wattage: 650, vendor: "Amazon", url: "https://amazon.com", image: IMG.psu },
    { id: "rm750x", name: "Corsair RM750x", price: 119, wattage: 750, vendor: "ShufflePCs", url: "https://shufflepcs.co.ke", image: IMG.psu },
    { id: "rm850x-2024", name: "Corsair RM850x (2024)", price: 149, wattage: 850, vendor: "Amazon", url: "https://amazon.com", image: IMG.psu },
    { id: "gx-1000", name: "Seasonic Focus GX-1000", price: 189, wattage: 1000, vendor: "ESGaming", url: "https://esgaming.co.ke", image: IMG.psu },
    { id: "prime-tx-1300", name: "Seasonic Prime TX-1300", price: 449, wattage: 1300, vendor: "ESGaming", url: "https://esgaming.co.ke", image: IMG.psu },
  ],
};

export const CATEGORIES = ["gpu", "cpu", "motherboard", "ram", "storage", "cooling", "case", "psu"];

export const CATEGORY_LABELS = {
  gpu: "Graphics",
  cpu: "Processor",
  motherboard: "Motherboard",
  ram: "Memory",
  storage: "Storage",
  cooling: "Cooling",
  case: "Chassis",
  psu: "Power Supply",
};
