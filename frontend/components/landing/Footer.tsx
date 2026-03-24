import { AnimatePresence, motion } from "motion/react";
import { LogoParticles } from "@/components/custom/logo-particles";
import { ReapLogo } from "@/components/custom/reap-logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-[90vw] mx-auto flex flex-col md:flex-row items-center justify-between gap-12"
      >
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10 relative flex items-center justify-center">
            <LogoParticles className="absolute inset-0 z-0 opacity-30 group-hover:opacity-60 transition-opacity" />
            <ReapLogo size={24} className="relative z-10 transition-transform duration-500 group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/50 group-hover:text-white transition-all duration-500">REAP</span>
            <span className="font-mono text-[6px] tracking-[0.3em] uppercase text-white/20 -mt-0.5">Real Estate Asset Protocol</span>
          </div>
        </div>

        <div className="flex items-center gap-10 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
          <a href="#" className="hover:text-white transition-all duration-300">Twitter</a>
          <a href="#" className="hover:text-white transition-all duration-300">LinkedIn</a>
          <a href="#" className="hover:text-white transition-all duration-300">Docs</a>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">
          © {new Date().getFullYear()} Real Estate Asset Protocol
        </p>
      </motion.div>
    </footer>
  );
}

