"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { LogoParticles } from "@/components/custom/logo-particles";
import { ReapLogo } from "@/components/custom/reap-logo";

export default function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8">
        <div className="flex items-center gap-2 sm:gap-4 group">
          <div className="w-12 sm:w-16 md:w-24 h-10 sm:h-12 md:h-16 relative flex items-center justify-center">
            <LogoParticles className="absolute inset-0 z-0 opacity-40 group-hover:opacity-80 transition-opacity" />
            <ReapLogo size={32} className="relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform duration-500 group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white/90 flex items-center gap-2">
              REAP
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
            </span>
            <span className="font-mono text-[7px] tracking-[0.3em] uppercase text-white/30 -mt-0.5">Real Estate Asset Protocol</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 bg-white/[0.03] border border-white/10 rounded-full px-8 py-2.5 backdrop-blur-xl">
          <a href="#problem" className="relative group overflow-hidden font-mono text-[9px] uppercase tracking-widest text-white/50 hover:text-white transition-all duration-300">
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-2 h-2" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5" cy="5" r="2" fill="currentColor" fillOpacity="0.4" />
              </svg>
              01 Problem
            </span>
          </a>
          <a href="#solution" className="relative group overflow-hidden font-mono text-[9px] uppercase tracking-widest text-white/50 hover:text-white transition-all duration-300">
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-2 h-2" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5" cy="5" r="2" fill="currentColor" fillOpacity="0.4" />
              </svg>
              02 Solution
            </span>
          </a>
          <a href="#compliance" className="relative group overflow-hidden font-mono text-[9px] uppercase tracking-widest text-white/50 hover:text-white transition-all duration-300">
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-2 h-2" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5" cy="5" r="2" fill="currentColor" fillOpacity="0.4" />
              </svg>
              03 Compliance
            </span>
          </a>
        </nav>

        <div className="flex items-center gap-6">
          <a href="#waitlist" className="hidden sm:block silver-btn px-10 py-3.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
            Join Waitlist
          </a>
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
            <a href="#waitlist" onClick={() => setIsMobileMenuOpen(false)} className="silver-btn w-full max-w-sm px-8 py-5 rounded-2xl font-mono text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform text-center">
              Join Waitlist
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
