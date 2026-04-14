"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { apiClient } from "@/lib/api";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function FinalCTASection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const response = await apiClient.joinWaitlist(email);
      if (response.success) {
        setStatus("success");
        setMessage("You've been added to the protocol waitlist.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(response.message || "Failed to join waitlist. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <section id="waitlist" className="w-[90vw] mx-auto py-64 text-center">
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

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col gap-4">
          <div className="frosted-glass p-1.5 rounded-3xl flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === "loading" || status === "success"}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-base px-6 py-4 placeholder:text-white/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="silver-btn px-10 py-4 rounded-2xl font-mono text-xs font-bold uppercase tracking-widest hover:scale-[1.05] active:scale-[0.95] transition-all whitespace-nowrap flex items-center justify-center gap-2 min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : status === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                "Join Waitlist"
              )}
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`font-mono text-[10px] uppercase tracking-widest ${
                  status === "error" ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
        <div className="mt-8 flex justify-center">
          <a href="/demo" className="px-12 py-5 w-full max-w-xl rounded-2xl font-mono text-xs font-bold uppercase tracking-widest demo-glass-btn hover:scale-[1.01] active:scale-[0.99] transition-all text-center">
            Try Demo
          </a>
        </div>
      </motion.div>
    </section>
  );
}

