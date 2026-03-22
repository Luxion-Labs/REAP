import { AnimatePresence, motion } from "motion/react";
import { GridDistortion } from "@/components/custom/grid-distortion";

const reasons = [
  "Institutional acceptance of tokenization",
  "Regulatory clarity across key markets",
  "Maturing blockchain infrastructure"
];

export default function WhyNowSection() {
  return (
    <section className="relative w-[90vw] mx-auto py-48 overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 z-0 opacity-30">
        <GridDistortion
          imageSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&grayscale=true"
          grid={30}
          mouse={0.2}
          strength={0.25}
          relaxation={0.92}
        />
      </div>
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="frosted-glass p-16 rounded-[3rem]"
        >
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">08 / Why Now</h2>
          <h3 className="font-serif italic text-5xl leading-[0.85] tracking-tighter mb-10">Three forces make this inevitable:</h3>
          <ol className="space-y-8 font-mono text-sm tracking-widest mb-16">
            {reasons.map((item, i) => (
              <li key={i} className="flex items-start gap-6 group">
                <span className="text-white/20 group-hover:text-white/60 transition-colors">{i + 1}.</span>
                <span className="text-white/80 group-hover:text-white transition-colors leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
          <p className="font-sans text-xl text-white/60 border-t border-white/10 pt-10 font-light leading-relaxed">
            For the first time, technology, capital, and regulation are aligned.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center"
        >
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">09 / Vision</h2>
          <h3 className="font-serif italic text-6xl md:text-8xl leading-[0.85] tracking-tighter mb-16">Real estate is becoming digital infrastructure.</h3>
          <div className="grid grid-cols-2 gap-12 border-t border-white/10 pt-12">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8">Ownership will no longer be:</p>
              <ul className="space-y-4 font-serif italic text-3xl text-white/30">
                <li className="hover:text-white/60 transition-all duration-500 cursor-default">slow</li>
                <li className="hover:text-white/60 transition-all duration-500 cursor-default">local</li>
                <li className="hover:text-white/60 transition-all duration-500 cursor-default">opaque</li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8">It will be:</p>
              <ul className="space-y-4 font-serif italic text-3xl text-white/90">
                <li className="hover:text-white transition-all duration-500 cursor-default underline decoration-white/20 underline-offset-8">instant</li>
                <li className="hover:text-white transition-all duration-500 cursor-default underline decoration-white/20 underline-offset-8">global</li>
                <li className="hover:text-white transition-all duration-500 cursor-default underline decoration-white/20 underline-offset-8">programmable</li>
              </ul>
            </div>
          </div>
          <p className="mt-16 font-sans text-lg text-white/50 font-light tracking-wide italic">REAP is building the protocol layer for that future.</p>
        </motion.div>
      </div>
    </section>
  );
}

