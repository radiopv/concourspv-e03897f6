import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import WhyParticipateSection from "@/components/home/WhyParticipateSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <WhyParticipateSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;