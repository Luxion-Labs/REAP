import { motion } from "motion/react";

export default function GapSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">03 / The Gap</h2>
      <h3 className="font-serif italic text-5xl md:text-6xl leading-[0.9] tracking-tighter mb-10">
        But the current solutions are incomplete.
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
        <div className="group">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 group-hover:text-white/50 transition-colors">Existing platforms focus on:</p>
          <ul className="space-y-4 font-sans text-white/50 text-base font-light">
            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/10 rounded-full" /> marketplaces</li>
            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/10 rounded-full" /> token issuance</li>
            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/10 rounded-full" /> surface-level digitization</li>
          </ul>
        </div>
        <div className="group">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 group-hover:text-white/50 transition-colors">What they don&apos;t solve:</p>
          <ul className="space-y-4 font-sans text-white/80 text-base">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-white/60 rounded-full" /> ownership-level infrastructure</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-white/60 rounded-full" /> privacy in ownership</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-white/60 rounded-full" /> seamless compliance</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-20 pt-12 border-t border-white/10">
        <p className="font-sans text-2xl text-white/70 leading-relaxed font-light">
          The hardest problem is not tokenization. <br/>
          <span className="text-white font-medium italic">It is trust, legality, and usability at scale.</span>
        </p>
      </div>
    </motion.div>
  );
}
