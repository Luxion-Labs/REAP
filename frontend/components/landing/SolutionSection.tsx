import { AnimatePresence, motion } from "motion/react";

const solutionBlocks = [
  { step: "01 / Digitize", title: "Core Digitization", desc: "Digitizes property ownership at its core, moving beyond surface-level tokens." },
  { step: "02 / Convert", title: "Fractional Assets", desc: "Converts assets into fractional, programmable tokens for ultimate flexibility." },
  { step: "03 / Privacy", title: "Verifiable Ownership", desc: "Enables private, verifiable ownership without exposing sensitive identity data." },
  { step: "04 / Compliance", title: "Built-in Compliance", desc: "Integrates compliance from the ground up, ensuring legal adherence automatically." }
];

export default function SolutionSection() {
  return (
    <section id="solution" className="w-full px-4 sm:px-6 lg:px-8 py-24 md:py-48 border-b border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-32"
      >
        <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">04 / The Solution</h2>
        <h3 className="font-serif italic text-4xl sm:text-5xl md:text-6xl lg:text-8xl leading-[0.95] md:leading-[0.85] tracking-tighter mb-8 sm:mb-10">
          REAP is real estate <br />infrastructure.
        </h3>
        <p className="font-sans text-xl text-white/50 max-w-3xl mx-auto leading-relaxed font-light">
          We are building a protocol that digitizes property ownership at its core, converting assets into fractional, programmable tokens.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {solutionBlocks.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card p-12 rounded-[2rem] flex flex-col justify-between aspect-square group hover:bg-white/[0.04] transition-all duration-700 cursor-default"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 group-hover:text-white/60 transition-colors">{item.step}</span>
            <div>
              <h4 className="font-serif italic text-4xl mb-6 group-hover:text-white transition-colors">{item.title}</h4>
              <p className="font-sans text-base text-white/50 group-hover:text-white/80 transition-colors leading-relaxed font-light">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-24 text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/30 mb-10">Real estate becomes:</p>
        <div className="flex flex-wrap justify-center gap-6">
          <span className="px-10 py-4 rounded-full border border-white/5 bg-white/[0.02] font-serif italic text-2xl hover:bg-white/10 transition-all duration-500 cursor-default">Liquid</span>
          <span className="px-10 py-4 rounded-full border border-white/5 bg-white/[0.02] font-serif italic text-2xl hover:bg-white/10 transition-all duration-500 cursor-default">Borderless</span>
          <span className="px-10 py-4 rounded-full border border-white/5 bg-white/[0.02] font-serif italic text-2xl hover:bg-white/10 transition-all duration-500 cursor-default">Programmable</span>
        </div>
        <p className="mt-12 font-sans text-xl text-white/60 font-light italic">As simple as transferring digital assets.</p>
      </motion.div>
    </section>
  );
}

