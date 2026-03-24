"use client";

import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import ShiftAndGapSection from "@/components/landing/ShiftAndGapSection";
import SolutionSection from "@/components/landing/SolutionSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ComplianceSection from "@/components/landing/ComplianceSection";
import WhyNowSection from "@/components/landing/WhyNowSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <LandingHeader />
      <HeroSection />
      <ProblemSection />
      <ShiftAndGapSection />
      <SolutionSection />
      <HowItWorksSection />
      <ComplianceSection />
      <WhyNowSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
