import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { TubesBackground } from "@/components/custom/tubes-background";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen">
      <TubesBackground enableClickInteraction={true} className="h-full">
        <div className="relative z-10 w-full max-w-[1200px] h-full mx-auto flex flex-col items-center justify-center text-center pt-16 sm:pt-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="frosted-glass hero-glass rounded-[2rem] sm:rounded-[3rem] md:rounded-[5rem] p-8 sm:p-12 md:p-24 max-w-6xl w-full flex flex-col items-center pointer-events-auto"
          >
            <h1 className="font-serif italic text-[clamp(48px,10vw,140px)] leading-[0.8] tracking-tighter mb-10">
              Make Real Estate <br />
              <span className="silver-gradient-text not-italic">Liquid</span>
            </h1>

            <p className="font-sans text-xl md:text-2xl text-white/70 max-w-3xl mb-16 font-light leading-relaxed">
              Real estate is the largest asset class in the world. Yet it remains one of the most illiquid. We are building the infrastructure to change that.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <button className="silver-btn w-full sm:w-auto px-12 py-5 rounded-2xl font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.05] active:scale-[0.95] transition-all">
                Join Waitlist <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-12 py-5 rounded-2xl font-mono text-xs font-bold uppercase tracking-widest demo-glass-btn hover:scale-[1.05] active:scale-[0.95] transition-all">
                Try Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-16 w-full max-w-5xl border-t border-white/10 pt-12"
          >
            <div className="flex flex-col items-center md:items-start group cursor-default">
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em] mb-2 group-hover:text-white/50 transition-colors">Asset Class</span>
              <span className="font-mono text-xs text-white/80 uppercase tracking-widest">$300T Global Market</span>
            </div>
            <div className="flex flex-col items-center group cursor-default">
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em] mb-2 group-hover:text-white/50 transition-colors">Infrastructure</span>
              <span className="font-mono text-xs text-white/80 uppercase tracking-widest">Institutional Grade</span>
            </div>
            <div className="flex flex-col items-center md:items-end group cursor-default">
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em] mb-2 group-hover:text-white/50 transition-colors">Status</span>
              <span className="font-mono text-xs text-white/80 uppercase tracking-widest">Private Beta</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 flex flex-col items-center gap-3 text-white/20 animate-pulse pointer-events-none"
          />
        </div>
      </TubesBackground>
    </section>
  );
}

