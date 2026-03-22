import ShiftSection from "./ShiftSection";
import GapSection from "./GapSection";

export default function ShiftAndGapSection() {
  return (
    <section className="w-[90vw] mx-auto py-48 border-b border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
        <ShiftSection />
        <GapSection />
      </div>
    </section>
  );
}
