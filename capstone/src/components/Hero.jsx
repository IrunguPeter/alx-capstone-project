// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Checkout from './checkout';

const STATS = [
  { value: '2,400+', label: 'Builds verified' },
  { value: '05', label: 'Marketplaces' },
  { value: '<1s', label: 'Curate response' },
];

const fade = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
});

const Hero = ({ onStartAI, onManual }) => {
  return (
    <section className="relative overflow-hidden grain bg-[#f6f3ec]">
      {/* Hairline frame */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-ink/10" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-36">
        <div className="max-w-3xl">
          <motion.p
            {...fade(0)}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60"
          >
            <span className="w-2 h-2 rounded-full bg-gold" />
            Part Picker — 2026
          </motion.p>

          <motion.h1
            {...fade(0.1)}
            className="mt-8 font-display font-medium text-[2.75rem] leading-[1.04] tracking-[-0.02em] text-ink sm:text-6xl xl:text-7xl"
          >
            The PC builder that{' '}
            <em className="font-light italic text-burgundy">checks its own math.</em>
          </motion.h1>

          <motion.p
            {...fade(0.2)}
            className="mt-7 max-w-xl text-lg font-light leading-relaxed text-ink/70"
          >
            Tell it your budget. It assembles a compatible 2026 build, then
            cross-checks sockets, clearance and wattage before you commit.
          </motion.p>

          <motion.div
            {...fade(0.3)}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <button
              onClick={onStartAI}
              className="bg-burgundy text-white px-9 py-4 rounded-full font-medium text-sm tracking-wide hover:bg-burgundy-deep transition-colors active:scale-[0.98]"
            >
              Start curated build
            </button>
            <button
              onClick={onManual}
              className="group flex items-center gap-2 px-2 py-4 font-medium text-sm tracking-wide text-ink hover:text-burgundy transition-colors"
            >
              Manual configurator
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <div className="w-full sm:w-auto">
              <Checkout label="Donate" allowCustomAmount={true} />
            </div>
          </motion.div>

          <motion.div
            {...fade(0.4)}
            className="mt-14 flex max-w-md divide-x divide-ink/10 border-t border-gold/40 pt-8"
          >
            {STATS.map((s) => (
              <div key={s.label} className="px-6 first:pl-0">
                <p className="font-display font-medium text-2xl text-ink">{s.value}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/45">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
