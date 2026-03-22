import { motion } from "motion/react";

export default function ShiftSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">02 / The Shift</h2>
      <h3 className="font-serif italic text-5xl md:text-6xl leading-[0.9] tracking-tighter mb-10">
        A structural shift is already underway.
      </h3>
      <p className="font-mono text-xs text-white/80 uppercase tracking-[0.2em] mb-10 border-l-2 border-white/10 pl-6 py-2">
        Tokenization is projected to reach $16 trillion+ by 2030.
      </p>
      <ul className="space-y-6 font-sans text-white/60 mb-16 text-lg font-light">
        <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 bg-white/40 rounded-full" /> 67% of investors are planning or already investing in tokenized assets</li>
        <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 bg-white/40 rounded-full" /> Nearly half of real estate firms are piloting tokenization</li>
        <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 bg-white/40 rounded-full" /> Institutional players are entering the space</li>
      </ul>
      <div className="frosted-glass p-10 rounded-2xl hover:bg-white/[0.03] transition-all duration-500 group">
        <p className="font-serif italic text-2xl text-white/80 mb-6 group-hover:text-white transition-colors leading-relaxed">&quot;Tokenization is the next generation for markets.&quot;</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 group-hover:text-white/50 transition-colors">— Larry Fink, CEO of BlackRock</p>
      </div>
    </motion.div>
  );
}
