import Link from "next/link";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import PolicyHighlights from "@/components/sections/PolicyHighlights";
import HowItWorks from "@/components/sections/HowItWorks";
import CTASection from "@/components/sections/CTASection";

export const metadata = {
  title: "InsureEase – Protect What Matters",
  description: "Manage insurance policies and claims with ease.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <PolicyHighlights />
      <HowItWorks />
      <CTASection />
    </>
  );
}