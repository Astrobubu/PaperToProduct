import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import LogosSection from "@/components/landing/LogosSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeatureSection from "@/components/landing/FeatureSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import RoadmapSection from "@/components/landing/RoadmapSection";
import InvestmentSection from "@/components/landing/InvestmentSection";
import FAQSection from "@/components/landing/FAQSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <HeroSection />
      <LogosSection />
      <HowItWorksSection />
      <FeatureSection />
      <UseCasesSection />
      <RoadmapSection />
      <InvestmentSection />
      <FAQSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}
