import { AnimatePresence, motion } from "motion/react";

const compliancePoints = [
  "Compliance-first architecture",
  "Integration with KYC/AML frameworks",
  "Jurisdiction-aware design",
  "Privacy-preserving ownership verification"
];

export default function ComplianceSection() {
  return (
    <section id="compliance" className="w-[90vw] mx-auto py-48 border-b border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">06 / Target</h2>
          <h3 className="font-serif italic text-5xl md:text-6xl leading-[0.9] tracking-tighter mb-10">Built for real estate firms.</h3>
          <p className="font-sans text-xl text-white/70 mb-10 leading-relaxed font-light">We are not building for speculation. We are building for real estate companies.</p>

          <div className="frosted-glass p-12 rounded-[2.5rem] mb-12 hover:bg-white/[0.03] transition-all duration-700 group">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-10 group-hover:text-white/50 transition-colors">REAP is designed to help firms:</p>
            <ul className="space-y-6 font-sans text-lg font-light text-white/70">
              <li className="flex items-center gap-4">raise capital faster</li>
              <li className="flex items-center gap-4">access global investors</li>
              <li className="flex items-center gap-4">reduce transaction friction</li>
              <li className="flex items-center gap-4">maintain regulatory compliance</li>
            </ul>
          </div>
          <p className="font-sans text-sm text-white/30 italic leading-relaxed">We are working closely with industry stakeholders to ensure the system aligns with real-world legal and operational needs.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">07 / Compliance</h2>
          <h3 className="font-serif italic text-5xl md:text-6xl leading-[0.9] tracking-tighter mb-10">Adoption depends on trust.</h3>

          <div className="space-y-6 mb-16">
            {compliancePoints.map((item, i) => (
              <div key={i} className="bento-card p-8 rounded-2xl group hover:bg-white/[0.04] transition-all duration-500 cursor-default">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/80 group-hover:text-white transition-all duration-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="border-l-2 border-white/10 pl-10 py-4">
            <p className="font-serif italic text-3xl text-white/80 mb-4">We are not bypassing regulation.</p>
            <p className="font-serif italic text-3xl text-white/80 mb-8">We are building within it.</p>
            <p className="font-sans text-base text-white/30 uppercase tracking-[0.2em]">Because real adoption requires it.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

