import { AnimatePresence, motion } from "motion/react";

export default function FinalCTASection() {
  return (
    <section className="w-[90vw] mx-auto py-64 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="font-serif italic text-6xl md:text-9xl leading-[0.8] tracking-tighter mb-12">
          Be part of the <br/><span className="silver-gradient-text not-italic">transition.</span>
        </h2>
        <p className="font-sans text-2xl text-white/50 max-w-3xl mx-auto mb-20 leading-relaxed font-light">
          Whether you&apos;re a real estate firm exploring tokenization or an investor looking to understand the future of ownership—we&apos;re building for you.
        </p>

        <div className="max-w-xl mx-auto frosted-glass p-3 rounded-3xl flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-base px-6 py-4 placeholder:text-white/20"
          />
          <button className="silver-btn px-12 py-4 rounded-2xl font-mono text-xs font-bold uppercase tracking-widest hover:scale-[1.05] active:scale-[0.95] transition-all whitespace-nowrap">
            Join Waitlist
          </button>
        </div>
      </motion.div>
    </section>
  );
}

