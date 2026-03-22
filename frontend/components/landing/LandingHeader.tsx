"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { LogoParticles } from "@/components/custom/logo-particles";

export default function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 sm:w-14 md:w-20 h-9 sm:h-10 md:h-12 relative">
            <LogoParticles />
          </div>
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white/90">REAP</span>
        </div>

        <nav className="hidden md:flex items-center gap-10 bg-white/5 border border-white/10 rounded-full px-10 py-3 backdrop-blur-xl">
          <a href="#problem" className="font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-all duration-300">01 Problem</a>
          <a href="#solution" className="font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-all duration-300">02 Solution</a>
          <a href="#compliance" className="font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-all duration-300">03 Compliance</a>
        </nav>

        <div className="flex items-center gap-6">
          <button className="hidden sm:block silver-btn px-10 py-3.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
            Join Waitlist
          </button>
          <button
            className="md:hidden p-3 text-white/80 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 mobile-nav-blur flex flex-col items-center justify-center pt-24 pb-12 px-8"
          >
            <nav className="flex flex-col items-center gap-12 mb-16">
              <a href="#problem" onClick={() => setIsMobileMenuOpen(false)} className="font-mono text-lg uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">Problem</a>
              <a href="#solution" onClick={() => setIsMobileMenuOpen(false)} className="font-mono text-lg uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">Solution</a>
              <a href="#compliance" onClick={() => setIsMobileMenuOpen(false)} className="font-mono text-lg uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">Compliance</a>
            </nav>
            <button className="silver-btn w-full max-w-sm px-8 py-5 rounded-2xl font-mono text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform">
              Join Waitlist
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
