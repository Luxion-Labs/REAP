import { AnimatePresence, motion } from "motion/react";

const testimonials = [
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
];

export default function TestimonialsSection() {
  return (
    <section className="w-[90vw] mx-auto py-48 border-b border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-32"
      >
        <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">10 / Trust</h2>
        <h3 className="font-serif italic text-6xl md:text-7xl leading-[0.85] tracking-tighter mb-10">Trusted by industry leaders.</h3>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card p-12 rounded-[2.5rem] flex flex-col justify-between group hover:bg-white/[0.04] transition-all duration-700 cursor-default"
          >
            <p className="font-serif italic text-2xl text-white/70 mb-12 group-hover:text-white transition-all duration-500 leading-relaxed">"{testimonial.quote}"</p>
            <div>
              <p className="font-mono text-xs text-white/90 uppercase tracking-[0.3em] mb-2">{testimonial.author}</p>
              <p className="font-sans text-[10px] text-white/30 uppercase tracking-[0.3em] font-light">{testimonial.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

