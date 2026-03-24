import { AnimatePresence, motion } from "motion/react";

export default function ProblemSection() {
  return (
    <section id="problem" className="w-full px-4 sm:px-6 lg:px-8 py-24 md:py-48 border-b border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">01 / The Problem</h2>
          <h3 className="font-serif italic text-4xl sm:text-5xl md:text-6xl lg:text-8xl leading-[0.95] md:leading-[0.85] tracking-tighter mb-8 sm:mb-10">
            Trillions in value. <br /><span className="text-white/30">Locked.</span>
          </h3>
          <p className="font-sans text-xl text-white/60 mb-10 max-w-lg leading-relaxed font-light">
            Real estate is worth over $300 trillion globally. But ownership is still slow to verify, difficult to transfer, dependent on intermediaries, and restricted by geography.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bento-card p-12 rounded-[2.5rem] hover:bg-white/[0.03] transition-all duration-700"
        >
          <ul className="space-y-8 font-mono text-sm tracking-wider">
            <li className="flex items-start gap-6 pb-8 border-b border-white/5 group">
              <span className="text-white/20 group-hover:text-white/60 transition-colors">01</span>
              <span className="text-white/70 group-hover:text-white transition-colors leading-relaxed">Buying or selling property takes weeks.</span>
            </li>
            <li className="flex items-start gap-6 pb-8 border-b border-white/5 group">
              <span className="text-white/20 group-hover:text-white/60 transition-colors">02</span>
              <span className="text-white/70 group-hover:text-white transition-colors leading-relaxed">Raising capital takes months.</span>
            </li>
            <li className="flex items-start gap-6 pb-8 border-b border-white/5 group">
              <span className="text-white/20 group-hover:text-white/60 transition-colors">03</span>
              <span className="text-white/70 group-hover:text-white transition-colors leading-relaxed">Ownership requires exposing more information than necessary.</span>
            </li>
            <li className="flex items-start gap-6 pt-2 group">
              <span className="text-white/20 group-hover:text-white/60 transition-colors">04</span>
              <span className="text-white/70 group-hover:text-white transition-colors leading-relaxed">The system was never designed for digital capital.</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
