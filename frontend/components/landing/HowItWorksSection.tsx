import { AnimatePresence, motion } from "motion/react";

const steps = [
  { num: "1", title: "Property Registration", desc: "Ownership documents are securely anchored on-chain." },
  { num: "2", title: "Asset Tokenization", desc: "Property is divided into fractional digital ownership units." },
  { num: "3", title: "Private Transfers", desc: "Ownership can be transferred securely and efficiently." },
  { num: "4", title: "Verification", desc: "Stake can be proven without exposing sensitive identity." }
];

export default function HowItWorksSection() {
  return (
    <section className="w-[90vw] mx-auto py-48 border-b border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">05 / How It Works</h2>
          <h3 className="font-serif italic text-6xl md:text-7xl leading-[0.85] tracking-tighter mb-8">From physical property to digital ownership.</h3>
          <p className="font-sans text-xl text-white/50 mb-12 font-light leading-relaxed">The result: A fully digital lifecycle of ownership.</p>
        </motion.div>

        <div className="space-y-8">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bento-card p-10 rounded-3xl flex gap-10 items-start group hover:bg-white/[0.04] transition-all duration-700 cursor-default"
            >
              <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 font-mono text-base group-hover:bg-white/20 transition-all duration-500">{item.num}</div>
              <div>
                <h4 className="font-serif italic text-3xl mb-4 group-hover:text-white transition-colors">{item.title}</h4>
                <p className="font-sans text-base text-white/50 group-hover:text-white/80 transition-colors leading-relaxed font-light">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

