"use client";

import { TubesBackground } from "@/components/ui/tubes-background";
import { GridDistortion } from "@/components/ui/grid-distortion";
import { LogoParticles } from "@/components/ui/logo-particles";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Building2, Globe2, ShieldCheck, Zap, Menu, X, MousePointer2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-8 w-[94vw] mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-14 md:w-20 h-10 md:h-12 relative">
            <LogoParticles />
          </div>
          <span className="font-mono text-xs tracking-[0.4em] uppercase text-white/90">REAP</span>
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

      {/* MOBILE MENU */}
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

      {/* HERO SECTION */}
      <section className="relative w-full h-screen">
        <TubesBackground enableClickInteraction={true} className="h-full">
          <div className="relative z-10 w-[92vw] h-full mx-auto flex flex-col items-center justify-center text-center pt-20">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="frosted-glass rounded-[3rem] md:rounded-[5rem] p-12 md:p-24 max-w-6xl w-full flex flex-col items-center pointer-events-auto"
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
                <button className="w-full sm:w-auto px-12 py-5 rounded-2xl font-mono text-xs font-bold uppercase tracking-widest border border-white/20 hover:bg-white/5 hover:scale-[1.05] active:scale-[0.95] transition-all">
                  Try Demo
                </button>
              </div>
            </motion.div>

            {/* Metadata Bar */}
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
            >
              <MousePointer2 className="w-5 h-5" />
              <span className="font-mono text-[8px] uppercase tracking-[0.4em]">Click to randomize neon</span>
            </motion.div>
          </div>
        </TubesBackground>
      </section>

      {/* SECTION 1 - THE PROBLEM */}
      <section id="problem" className="w-[90vw] mx-auto py-48 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">01 / The Problem</h2>
            <h3 className="font-serif italic text-6xl md:text-8xl leading-[0.85] tracking-tighter mb-10">
              Trillions in value. <br/><span className="text-white/30">Locked.</span>
            </h3>
            <p className="font-sans text-xl text-white/60 mb-10 max-w-lg leading-relaxed font-light">
              Real estate is worth over $300 trillion globally. But ownership is still slow to verify, difficult to transfer, dependent on intermediaries, and restricted by geography.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card p-12 rounded-[2.5rem] hover:bg-white/[0.03] transition-all duration-700"
          >
            <ul className="space-y-8 font-mono text-sm tracking-wider">
              <li className="flex items-start gap-6 pb-8 border-b border-white/5 group">
                <span className="text-white/20 group-hover:text-white/60 transition-colors">01</span>
                <span className="text-white/70 group-hover:text-white transition-colors leading-relaxed">Buying or selling property takes weeks.</span>
              </li>
              <li className="flex items-start gap-6 pb-8 border-b border-white/5 group">
                <span className="text-white/20 group-hover:text-white/60 transition-colors">02</span>
                <span className="text-white/70 group-hover:text-white transition-colors leading-relaxed">Raising capital takes months.</span>
              </li>
              <li className="flex items-start gap-6 pb-8 border-b border-white/5 group">
                <span className="text-white/20 group-hover:text-white/60 transition-colors">03</span>
                <span className="text-white/70 group-hover:text-white transition-colors leading-relaxed">Ownership requires exposing more information than necessary.</span>
              </li>
              <li className="flex items-start gap-6 pt-2 group">
                <span className="text-white/20 group-hover:text-white/60 transition-colors">04</span>
                <span className="text-white/70 group-hover:text-white transition-colors leading-relaxed">The system was never designed for digital capital.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 & 3 - THE SHIFT & THE GAP */}
      <section className="w-[90vw] mx-auto py-48 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          {/* The Shift */}
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
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 bg-white/40 rounded-full"/> 67% of investors are planning or already investing in tokenized assets</li>
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 bg-white/40 rounded-full"/> Nearly half of real estate firms are piloting tokenization</li>
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 bg-white/40 rounded-full"/> Institutional players are entering the space</li>
            </ul>
            <div className="frosted-glass p-10 rounded-2xl hover:bg-white/[0.03] transition-all duration-500 group">
              <p className="font-serif italic text-2xl text-white/80 mb-6 group-hover:text-white transition-colors leading-relaxed">&quot;Tokenization is the next generation for markets.&quot;</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 group-hover:text-white/50 transition-colors">— Larry Fink, CEO of BlackRock</p>
            </div>
          </motion.div>

          {/* The Gap */}
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
                  <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/10 rounded-full"/> marketplaces</li>
                  <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/10 rounded-full"/> token issuance</li>
                  <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/10 rounded-full"/> surface-level digitization</li>
                </ul>
              </div>
              <div className="group">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 group-hover:text-white/50 transition-colors">What they don&apos;t solve:</p>
                <ul className="space-y-4 font-sans text-white/80 text-base">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-white/60 rounded-full"/> ownership-level infrastructure</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-white/60 rounded-full"/> privacy in ownership</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-white/60 rounded-full"/> seamless compliance</li>
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
        </div>
      </section>

      {/* SECTION 4 - THE SOLUTION (Bento Grid) */}
      <section id="solution" className="w-[90vw] mx-auto py-48 border-b border-white/10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-32"
        >
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">04 / The Solution</h2>
          <h3 className="font-serif italic text-6xl md:text-8xl leading-[0.85] tracking-tighter mb-10">
            REAP is real estate <br/>infrastructure.
          </h3>
          <p className="font-sans text-xl text-white/50 max-w-3xl mx-auto leading-relaxed font-light">
            We are building a protocol that digitizes property ownership at its core, converting assets into fractional, programmable tokens.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01 / Digitize", title: "Core Digitization", desc: "Digitizes property ownership at its core, moving beyond surface-level tokens." },
            { step: "02 / Convert", title: "Fractional Assets", desc: "Converts assets into fractional, programmable tokens for ultimate flexibility." },
            { step: "03 / Privacy", title: "Verifiable Ownership", desc: "Enables private, verifiable ownership without exposing sensitive identity data." },
            { step: "04 / Compliance", title: "Built-in Compliance", desc: "Integrates compliance from the ground up, ensuring legal adherence automatically." },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bento-card p-12 rounded-[2rem] flex flex-col justify-between aspect-square group hover:bg-white/[0.04] transition-all duration-700 cursor-default"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 group-hover:text-white/60 transition-colors">{item.step}</span>
              <div>
                <h4 className="font-serif italic text-4xl mb-6 group-hover:text-white transition-colors">{item.title}</h4>
                <p className="font-sans text-base text-white/50 group-hover:text-white/80 transition-colors leading-relaxed font-light">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 text-center"
        >
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/30 mb-10">Real estate becomes:</p>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="px-10 py-4 rounded-full border border-white/5 bg-white/[0.02] font-serif italic text-2xl hover:bg-white/10 transition-all duration-500 cursor-default">Liquid</span>
            <span className="px-10 py-4 rounded-full border border-white/5 bg-white/[0.02] font-serif italic text-2xl hover:bg-white/10 transition-all duration-500 cursor-default">Borderless</span>
            <span className="px-10 py-4 rounded-full border border-white/5 bg-white/[0.02] font-serif italic text-2xl hover:bg-white/10 transition-all duration-500 cursor-default">Programmable</span>
          </div>
          <p className="mt-12 font-sans text-xl text-white/60 font-light italic">As simple as transferring digital assets.</p>
        </motion.div>
      </section>

      {/* SECTION 5 - HOW IT WORKS */}
      <section className="w-[90vw] mx-auto py-48 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">05 / How It Works</h2>
            <h3 className="font-serif italic text-6xl md:text-7xl leading-[0.85] tracking-tighter mb-8">
              From physical property to digital ownership.
            </h3>
            <p className="font-sans text-xl text-white/50 mb-12 font-light leading-relaxed">
              The result: A fully digital lifecycle of ownership.
            </p>
          </motion.div>
          
          <div className="space-y-8">
            {[
              { num: "1", title: "Property Registration", desc: "Ownership documents are securely anchored on-chain." },
              { num: "2", title: "Asset Tokenization", desc: "Property is divided into fractional digital ownership units." },
              { num: "3", title: "Private Transfers", desc: "Ownership can be transferred securely and efficiently." },
              { num: "4", title: "Verification", desc: "Stake can be proven without exposing sensitive identity." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bento-card p-10 rounded-3xl flex gap-10 items-start group hover:bg-white/[0.04] transition-all duration-700 cursor-default"
              >
                <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 font-mono text-base group-hover:bg-white/20 transition-all duration-500">{item.num}</div>
                <div>
                  <h4 className="font-serif italic text-3xl mb-4 group-hover:text-white transition-colors">{item.title}</h4>
                  <p className="font-sans text-base text-white/50 group-hover:text-white/80 transition-colors leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 & 7 - BUILT FOR FIRMS & COMPLIANCE */}
      <section id="compliance" className="w-[90vw] mx-auto py-48 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          {/* Built for Firms */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">06 / Target</h2>
            <h3 className="font-serif italic text-5xl md:text-6xl leading-[0.9] tracking-tighter mb-10">
              Built for real estate firms.
            </h3>
            <p className="font-sans text-xl text-white/70 mb-10 leading-relaxed font-light">
              We are not building for speculation. We are building for real estate companies.
            </p>
            <div className="frosted-glass p-12 rounded-[2.5rem] mb-12 hover:bg-white/[0.03] transition-all duration-700 group">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-10 group-hover:text-white/50 transition-colors">REAP is designed to help firms:</p>
              <ul className="space-y-6 font-sans text-lg font-light text-white/70">
                <li className="flex items-center gap-4 group/item"><Building2 className="w-5 h-5 text-white/30 group-hover/item:text-white transition-colors" /> <span className="group-hover/item:text-white transition-colors">raise capital faster</span></li>
                <li className="flex items-center gap-4 group/item"><Globe2 className="w-5 h-5 text-white/30 group-hover/item:text-white transition-colors" /> <span className="group-hover/item:text-white transition-colors">access global investors</span></li>
                <li className="flex items-center gap-4 group/item"><Zap className="w-5 h-5 text-white/30 group-hover/item:text-white transition-colors" /> <span className="group-hover/item:text-white transition-colors">reduce transaction friction</span></li>
                <li className="flex items-center gap-4 group/item"><ShieldCheck className="w-5 h-5 text-white/30 group-hover/item:text-white transition-colors" /> <span className="group-hover/item:text-white transition-colors">maintain regulatory compliance</span></li>
              </ul>
            </div>
            <p className="font-sans text-sm text-white/30 italic leading-relaxed">
              We are working closely with industry stakeholders to ensure the system aligns with real-world legal and operational needs.
            </p>
          </motion.div>

          {/* Compliance & Trust */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">07 / Compliance</h2>
            <h3 className="font-serif italic text-5xl md:text-6xl leading-[0.9] tracking-tighter mb-10">
              Adoption depends on trust.
            </h3>
            
            <div className="space-y-6 mb-16">
              {[
                "Compliance-first architecture",
                "Integration with KYC/AML frameworks",
                "Jurisdiction-aware design",
                "Privacy-preserving ownership verification"
              ].map((text, i) => (
                <div key={i} className="bento-card p-8 rounded-2xl group hover:bg-white/[0.04] transition-all duration-500 cursor-default">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/80 group-hover:text-white transition-all duration-300">{text}</p>
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

      {/* SECTION 8 & 9 - WHY NOW & VISION */}
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
            <h3 className="font-serif italic text-5xl leading-[0.85] tracking-tighter mb-10">
              Three forces make this inevitable:
            </h3>
            <ol className="space-y-8 font-mono text-sm tracking-widest mb-16">
              <li className="flex items-start gap-6 group">
                <span className="text-white/20 group-hover:text-white/60 transition-colors">1.</span>
                <span className="text-white/80 group-hover:text-white transition-colors leading-relaxed">Institutional acceptance of tokenization</span>
              </li>
              <li className="flex items-start gap-6 group">
                <span className="text-white/20 group-hover:text-white/60 transition-colors">2.</span>
                <span className="text-white/80 group-hover:text-white transition-colors leading-relaxed">Regulatory clarity across key markets</span>
              </li>
              <li className="flex items-start gap-6 group">
                <span className="text-white/20 group-hover:text-white/60 transition-colors">3.</span>
                <span className="text-white/80 group-hover:text-white transition-colors leading-relaxed">Maturing blockchain infrastructure</span>
              </li>
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
            <h3 className="font-serif italic text-6xl md:text-8xl leading-[0.85] tracking-tighter mb-16">
              Real estate is becoming digital infrastructure.
            </h3>
            
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
            
            <p className="mt-16 font-sans text-lg text-white/50 font-light tracking-wide italic">
              REAP is building the protocol layer for that future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="w-[90vw] mx-auto py-48 border-b border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-32"
        >
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">10 / Trust</h2>
          <h3 className="font-serif italic text-6xl md:text-7xl leading-[0.85] tracking-tighter mb-10">
            Trusted by industry leaders.
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              quote: "REAP has fundamentally changed how we view asset liquidity. The compliance-first approach is exactly what the industry needed.",
              author: "Elena Rostova",
              role: "Managing Director, Apex Capital"
            },
            {
              quote: "The ability to tokenize our commercial portfolio without exposing sensitive data to public ledgers is a game-changer.",
              author: "Marcus Chen",
              role: "Head of Digital Assets, Horizon Real Estate"
            },
            {
              quote: "Finally, a protocol that understands the legal complexities of real estate instead of just trying to force it on-chain.",
              author: "Sarah Jenkins",
              role: "Partner, Global Property Partners"
            }
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bento-card p-12 rounded-[2.5rem] flex flex-col justify-between group hover:bg-white/[0.04] transition-all duration-700 cursor-default"
            >
              <p className="font-serif italic text-2xl text-white/70 mb-12 group-hover:text-white transition-all duration-500 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
              <div>
                <p className="font-mono text-xs text-white/90 uppercase tracking-[0.3em] mb-2">{testimonial.author}</p>
                <p className="font-sans text-[10px] text-white/30 uppercase tracking-[0.3em] font-light">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
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

      {/* FOOTER */}
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
    </main>
  );
}
