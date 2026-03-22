import { AnimatePresence, motion } from "motion/react";
import { LogoParticles } from "@/components/custom/logo-particles";

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
          <div className="w-14 h-8 relative opacity-60 group-hover:opacity-100 transition-all duration-500">
            <LogoParticles />
          </div>
          <span className="font-mono text-xs tracking-[0.4em] uppercase text-white/60 group-hover:text-white transition-all duration-500">REAP</span>
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

