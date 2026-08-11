import { CATALOG, CATEGORIES, CATEGORY_LABELS } from '../data/partsCatalog.js';

// ---------------------------------------------------------------------------
// Deterministic build curator.
// Encodes classic PC-building heuristics as data + scoring functions.
// No prompts, no network, no randomness: same input -> same build, every time.
// ---------------------------------------------------------------------------

// Base share of budget allocated to each category (sums to 1.0).
const BASE_SPLIT = {
  gpu: 0.34,
  cpu: 0.22,
  motherboard: 0.09,
  ram: 0.06,
  storage: 0.07,
  cooling: 0.04,
  case: 0.07,
  psu: 0.11,
};

// How the intent profile nudges the split around the base.
function allocationsFor(profile, budget) {
  const g = profile.gaming ?? 0;
  const p = profile.productivity ?? 0;
  const alloc = { ...BASE_SPLIT };
  alloc.gpu += 0.06 * g - 0.04 * p;
  alloc.cpu += 0.06 * p - 0.03 * g;
  alloc.ram += 0.02 * p;
  alloc.storage += 0.02 * p - 0.01 * g;
  alloc.cooling += 0.01 * p;
  alloc.motherboard += 0.01 * p;
  alloc.psu -= 0.02 * g;

  const result = {};
  for (const [key, weight] of Object.entries(alloc)) {
    result[key] = budget * Math.min(0.45, Math.max(0.03, weight));
  }
  return result;
}

// Required PSU wattage: component draw plus a safety margin, rounded up.
function requiredPsuWattage(totalTdp) {
  return Math.ceil((totalTdp * 1.35) / 50) * 50;
}

function costFit(part, alloc) {
  if (part.price <= alloc) return 1;
  return Math.max(0.05, 1 - (part.price - alloc) / Math.max(1, alloc));
}

function perfFit(part, profile) {
  const g = profile.gaming ?? 0;
  const p = profile.productivity ?? 0;
  const denom = g + p || 1;
  return (part.perf.gaming * g + part.perf.productivity * p) / denom / 100;
}

// Value mode (budget preset) rewards performance per dollar.
function scoreCategory(category, part, ctx) {
  const { profile } = ctx;
  const alloc = ctx.alloc[category] || 0;
  let score;

  switch (category) {
    case 'gpu': {
      const targetVram = profile.productivity > 0.7 ? 32 : profile.gaming > 0.7 ? 16 : 12;
      const vramFit = Math.min(1, part.vram / targetVram);
      score = (0.7 * perfFit(part, profile) + 0.3 * vramFit) * costFit(part, alloc);
      break;
    }
    case 'cpu':
      score = perfFit(part, profile) * costFit(part, alloc);
      break;
    case 'motherboard':
      score = costFit(part, alloc);
      break;
    case 'ram': {
      const target = profile.productivity > 0.7 ? 64 : 32;
      const capFit = Math.min(1, part.capacityGB / target);
      score = (0.5 * capFit + 0.5) * costFit(part, alloc);
      break;
    }
    case 'storage': {
      const target = profile.productivity > 0.7 ? 4000 : 2000;
      const capFit = Math.min(1, part.capacityGB / target);
      score = (0.4 * capFit + 0.6) * costFit(part, alloc);
      break;
    }
    case 'cooling': {
      const needsLiquid = (ctx.picks.cpu?.tdp ?? 0) >= 120;
      const typeFit = part.type === 'Liquid' ? (needsLiquid ? 1 : 0.85) : needsLiquid ? 0.7 : 1;
      score = typeFit * costFit(part, alloc);
      break;
    }
    case 'case': {
      const gpuFit = Math.min(1, part.gpuClearance / Math.max(1, ctx.picks.gpu?.length ?? 1));
      const coolerFit = Math.min(1, part.cpuClearance / Math.max(1, ctx.picks.cooling?.height ?? 1));
      score = (0.5 * gpuFit + 0.5 * coolerFit) * costFit(part, alloc);
      break;
    }
    case 'psu': {
      const required = requiredPsuWattage(ctx.totalTdp);
      if (part.wattage < required) return -1;
      const headroom = part.wattage >= required * 1.25 ? 1 : 0.9;
      score = costFit(part, alloc) * headroom;
      break;
    }
    default:
      score = costFit(part, alloc);
  }

  if (profile.value) {
    score = score / Math.pow(part.price / 100, 0.65);
  }
  return score;
}

function isPartCompatible(category, part, ctx) {
  const { picks } = ctx;
  switch (category) {
    case 'motherboard':
      return part.socket === picks.cpu?.socket;
    case 'ram':
      return part.ramType === (picks.motherboard?.ramType || picks.cpu?.ramType);
    case 'case': {
      if (picks.motherboard?.size === 'ATX' && part.size !== 'ATX') return false;
      if (picks.gpu && part.gpuClearance < picks.gpu.length) return false;
      if (picks.cooling && part.cpuClearance < picks.cooling.height) return false;
      return true;
    }
    case 'psu':
      return part.wattage >= requiredPsuWattage(ctx.totalTdp);
    default:
      return true;
  }
}

function sortByScore(a, b) {
  if (b.score !== a.score) return b.score - a.score;
  return b.part.price - a.part.price;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

// Build an intent profile from a preset key.
// preset: 'budget' | 'gaming' | 'workstation' | 'extreme'
export function buildProfile(preset) {
  const profiles = {
    budget: { gaming: 0.5, productivity: 0.3, value: 1 },
    gaming: { gaming: 0.95, productivity: 0.25, value: 0 },
    workstation: { gaming: 0.25, productivity: 0.95, value: 0 },
    extreme: { gaming: 1.0, productivity: 0.8, value: 0 },
  };
  return profiles[preset] || profiles.budget;
}

// Pick the best-scoring compatible part for a category given current context.
export function pickPart(category, ctx) {
  const ranked = CATALOG[category]
    .filter((part) => isPartCompatible(category, part, ctx))
    .map((part) => ({ part, score: scoreCategory(category, part, ctx) }))
    .sort(sortByScore);
  return ranked[0]?.part || null;
}

const ORDER = ['gpu', 'cpu', 'motherboard', 'ram', 'storage', 'cooling', 'case', 'psu'];

function emptyPicks() {
  return { gpu: null, cpu: null, motherboard: null, ram: null, storage: null, cooling: null, case: null, psu: null };
}

// One full build attempt: greedy selection in dependency order, then a settle
// pass that trades down the most expensive categories until the budget fits.
function run(profile, alloc, parsedBudget) {
  let picks = emptyPicks();

  const buildCtx = () => ({
    profile,
    alloc,
    picks,
    totalTdp: Object.values(picks).reduce((sum, part) => sum + (part?.tdp || 0), 0),
  });

  for (const category of ORDER) {
    picks[category] = pickPart(category, buildCtx());
  }

  let iterations = 0;
  while (iterations < 40) {
    const total = Object.values(picks).reduce((sum, part) => sum + (part?.price || 0), 0);
    if (total <= parsedBudget) break;

    let bestSwap = null;
    for (const category of CATEGORIES) {
      const current = picks[category];
      if (!current) continue;
      const cheaper = CATALOG[category]
        .filter((part) => part.price < current.price && isPartCompatible(category, part, buildCtx()))
        .map((part) => ({ part, score: scoreCategory(category, part, buildCtx()) }))
        .sort(sortByScore);
      if (!cheaper.length) continue;
      const candidate = cheaper[0];
      const savings = current.price - candidate.part.price;
      if (!bestSwap || savings > bestSwap.savings) {
        bestSwap = { category, part: candidate.part, savings };
      }
    }

    if (!bestSwap) break;
    picks[bestSwap.category] = bestSwap.part;
    // Re-derive dependents of any swapped socket/clearance/wattage part.
    for (const category of ['motherboard', 'ram', 'cooling', 'case', 'psu']) {
      picks[category] = pickPart(category, buildCtx());
    }
    iterations += 1;
  }

  return picks;
}

// Compose a full build. Returns { items, total, totalTdp, requiredPsu, overBudget }.
export function composeBuild(preset, budget) {
  const profile = buildProfile(preset);
  const parsedBudget = Math.max(1, Number(budget) || 1000);
  const alloc = allocationsFor(profile, parsedBudget);

  // Greedy + settle, then polish: if there is notable unspent budget, scale the
  // allocations up and re-run so premium tiers get a chance.
  let picks = run(profile, alloc, parsedBudget);
  let total = Object.values(picks).reduce((sum, part) => sum + (part?.price || 0), 0);

  for (let i = 0; i < 6 && total < parsedBudget * 0.94; i += 1) {
    const scaled = {};
    for (const key of CATEGORIES) scaled[key] = alloc[key] * (parsedBudget / Math.max(1, total));
    const nextPicks = run(profile, scaled, parsedBudget);
    const nextTotal = Object.values(nextPicks).reduce((sum, part) => sum + (part?.price || 0), 0);
    if (nextTotal <= total) break;
    picks = nextPicks;
    total = nextTotal;
  }

  const totalTdp = Object.values(picks).reduce((sum, part) => sum + (part?.tdp || 0), 0);
  const requiredPsu = requiredPsuWattage(totalTdp);

  const items = CATEGORIES.map((category) => {
    const part = picks[category];
    if (!part) return null;
    return {
      category,
      label: CATEGORY_LABELS[category],
      name: part.name,
      price: part.price,
      tdp: part.tdp,
      wattage: part.wattage,
      vendor: part.vendor,
      url: part.url,
      image: part.image,
      rationale: rationale(category, part, profile),
    };
  }).filter(Boolean);

  return {
    preset,
    profile,
    items,
    total,
    totalTdp,
    requiredPsu,
    overBudget: total > parsedBudget,
    overBudgetBy: Math.max(0, total - parsedBudget),
  };
}

// Rule-based one-line justification for a chosen part.
export function rationale(category, part, profile) {
  const p = profile.productivity ?? 0;
  const g = profile.gaming ?? 0;
  switch (category) {
    case 'gpu':
      if (p > 0.7) return `${part.vram}GB VRAM for rendering & AI workloads`;
      if (g > 0.7) return `${part.vram}GB VRAM for high-refresh gaming`;
      return 'Balanced 1080p-1440p performance';
    case 'cpu':
      if (p > 0.7) return `${part.cores} cores for parallel workloads`;
      if (g > 0.7) return 'Low-latency gaming cores';
      return 'Best value in its tier';
    case 'motherboard':
      return `Mates with your ${part.socket} processor`;
    case 'ram':
      return `${part.capacityGB}GB ${part.ramType} for headroom`;
    case 'storage':
      return `${Math.round(part.capacityGB / 1000)}TB NVMe for the games & projects you keep`;
    case 'cooling':
      return part.type === 'Liquid' ? 'AIO liquid loop for hot chips' : 'Twin-tower air, silent under load';
    case 'case':
      return 'Fits your components with clearance to spare';
    case 'psu':
      return `Rated ${part.wattage}W with safety headroom`;
    default:
      return '';
  }
}
